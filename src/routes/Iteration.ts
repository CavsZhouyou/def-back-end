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
  const {
    userId,
    appName,
    repository,
    description,
    productTypeId,
    publishTypeId,
  } = req.body;

  if (
    !(
      userId &&
      appName &&
      repository &&
      description &&
      productTypeId &&
      publishTypeId
    )
  ) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const onlineAddress = '暂无发布';
  const pagePrefix = '/webapp/publish';
  const codeReviewSetting = codeReviewSettingRepository.create({
    isOpen: true,
    reviewerScope: await reviewerScopeTypeRepository.findOne(),
  });
  const creator = await userRepository.findOne({ userId });
  const publishType = await publishTypeRepository.findOne({
    code: publishTypeId,
  });
  const appLogo = publishType.logo;
  const productType = await productTypeRepository.findOne({
    code: productTypeId,
  });
  const createTime = new Date().getTime();
  const progressingIterationCount = 0;

  const app = appRepository.create({
    appName,
    description,
    appLogo,
    repository,
    onlineAddress,
    pagePrefix,
    createTime,
    codeReviewSetting,
    creator,
    publishType,
    productType,
    progressingIterationCount,
  });

  const savedApp = await appRepository.save(app);

  return res.status(OK).json({
    success: true,
    data: {
      appId: savedApp.appId,
      appName: savedApp.appName,
    },
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
