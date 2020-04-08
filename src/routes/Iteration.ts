import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  userRepository,
  appRepository,
  codeReviewSettingRepository,
  reviewerScopeTypeRepository,
  publishTypeRepository,
  productTypeRepository,
  iterationStatusRepository,
  iterationRepository,
} from '@shared/repositories';
import { App } from '@entity/App';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *                      获取迭代列表 - "POST/def/iteration/getIterationList"
 ******************************************************************************/

router.post('/getIterationList', async (req: Request, res: Response) => {
  const { userId, appName, publishType, page, pageSize } = req.body;

  if (!(page && pageSize && publishType)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let apps: App[] = [];
  let queryOptions: any = {};
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = ['iterations', 'publishType'];

  if (appName) queryOptions.appName = appName;
  if (publishType.length >= 1)
    queryOptions.publishType = await publishTypeRepository.findOne({
      code: publishType[0],
    });
  if (userId)
    queryOptions.creator = await userRepository.findOne({
      userId,
    });

  // 用户列表查询
  apps = await appRepository.find({
    where: {
      ...queryOptions,
    },
    relations,
  });
  total = apps.length;

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + pageSize < total;

    if (hasMore) {
      apps = apps.slice(dataStart, pageSize);
    } else {
      apps = apps.slice(dataStart);
    }
  }

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      //   list: apps
      list: [],
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
