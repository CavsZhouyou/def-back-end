import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  userRepository,
  appRepository,
  iterationStatusRepository,
  iterationRepository,
} from '@shared/repositories';
import { Iteration } from '@entity/Iteration';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *               获取迭代列表 - "POST/def/iteration/getIterationList"
 ******************************************************************************/

router.post('/getIterationList', async (req: Request, res: Response) => {
  const { userId, appId, iterationStatus, page, pageSize } = req.body;

  if (!(page && pageSize && userId && iterationStatus)) {
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
      iterations = iterations.slice(dataStart, pageSize);
    } else {
      iterations = iterations.slice(dataStart);
    }
  }

  const formattedIterations: any[] = [];

  iterations.forEach((item: Iteration) => {
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

    //TODO: publish 处理

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
 *                                 Export Router
 ******************************************************************************/

export default router;
