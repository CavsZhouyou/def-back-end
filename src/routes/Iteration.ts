import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  userRepository,
  appRepository,
  iterationStatusRepository,
  iterationRepository,
  publishRepository,
} from '@shared/repositories';
import { Iteration } from '@entity/Iteration';
import { asyncForEach } from 'src/utils';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *               获取迭代列表 - "POST/def/iteration/getIterationList"
 ******************************************************************************/

router.post('/getIterationList', async (req: Request, res: Response) => {
  const { userId, appId, iterationStatus, page, pageSize } = req.body;

  if (!(page && pageSize && iterationStatus)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let iterations: Iteration[] = [];
  let queryOptions: any = {};
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = ['app', 'creator', 'iterationStatus', 'publishes'];

  if (userId)
    queryOptions.creator = await userRepository.findOne({
      userId,
    });
  if (appId)
    queryOptions.app = await appRepository.findOne({
      appId,
    });
  if (iterationStatus.length >= 1)
    queryOptions.iterationStatus = await iterationStatusRepository.findOne({
      code: iterationStatus[0],
    });

  // 用户列表查询
  // TODO: 现在为用户创建的迭代，和发布关联后需要查询用户参与的迭代
  iterations = await iterationRepository.find({
    where: {
      ...queryOptions,
    },
    relations,
  });
  total = iterations.length;

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + pageSize < total;

    if (hasMore) {
      iterations = iterations.splice(dataStart, pageSize);
    } else {
      iterations = iterations.splice(dataStart);
    }
  }

  const formattedIterations: any[] = [];

  await asyncForEach(iterations, async (item: Iteration) => {
    const {
      iterationId,
      version,
      iterationName,
      createTime,
      endTime,
      branch,
      app,
      creator,
      publishes,
      iterationStatus,
    } = item;

    const { appId, appLogo, appName } = app;
    const { userName: creatorName, userAvatar: creatorAvatar } = creator;
    const completePublishes = await publishRepository.find({
      where: publishes,
      relations: ['publishStatus'],
    });
    const {
      createTime: latestPublish,
      publishStatus: { code: latestPublishStatus },
    } = completePublishes[0];

    formattedIterations.push({
      appId,
      appLogo,
      appName,
      creatorName,
      creatorAvatar,
      iterationId,
      version,
      iterationName,
      createTime,
      endTime,
      branch,
      iterationStatus: iterationStatus.code,
      latestPublish,
      latestPublishStatus,
    });
  });

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      list: formattedIterations,
    },
  });
});

/******************************************************************************
 *                      新建迭代 - "POST/def/iteration/createIteration"
 ******************************************************************************/

router.post('/createIteration', async (req: Request, res: Response) => {
  const { userId, appId, branch, iterationName, description } = req.body;

  if (
    !(userId && appId && branch && description && iterationName && description)
  ) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const version = branch.split('/')[1];
  const createTime = new Date().getTime();
  const endTime = '0';
  const master = 'master';
  const creator = await userRepository.findOne({ userId });
  const app = await appRepository.findOne({ appId });
  const iterationStatus = await iterationStatusRepository.findOne({
    code: '3002',
  });

  const iteration = iterationRepository.create({
    iterationName,
    description,
    version,
    createTime,
    endTime,
    branch,
    master,
    iterationStatus,
    creator,
    app,
  });

  const savedIteration = await iterationRepository.save(iteration);

  // 对应应用进行中的迭代数加 1
  app.progressingIterationCount = app.progressingIterationCount + 1;
  await appRepository.save(app);

  return res.status(OK).json({
    success: true,
    data: {
      appId: app.appId,
      appName: app.appName,
      iterationId: savedIteration.iterationId,
      iterationName: savedIteration.iterationName,
    },
  });
});

/******************************************************************************
 *               获取迭代详情 - "POST/def/iteration/getIterationDetail"
 ******************************************************************************/

router.post('/getIterationDetail', async (req: Request, res: Response) => {
  const { iterationId } = req.body;

  if (!iterationId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const iteration = await iterationRepository.findOne(
    {
      iterationId,
    },
    {
      relations: ['app', 'creator', 'iterationStatus', 'publishes'],
    }
  );

  const {
    version,
    description,
    iterationName,
    createTime,
    branch,
    creator,
    master,
    iterationStatus,
  } = iteration;

  const { userName } = creator;

  return res.status(OK).json({
    success: true,
    data: {
      creator: userName,
      description,
      master,
      version,
      iterationName,
      createTime,
      branch,
      iterationStatus: iterationStatus.code,
    },
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
