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
  memberRoleRepository,
  memberRepository,
} from '@shared/repositories';
import { App } from '@entity/App';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *                      获取应用列表 - "POST/def/app/getAppList"
 ******************************************************************************/

router.post('/getAppList', async (req: Request, res: Response) => {
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
      list: apps,
    },
  });
});

/******************************************************************************
 *            获取我的应用列表(app option) - "POST/def/app/getMyAppList"
 ******************************************************************************/

router.post('/getMyAppList', async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let apps: App[] = [];
  let queryOptions: any = {};

  queryOptions.creator = await userRepository.findOne({
    userId,
  });

  // 用户列表查询
  apps = await appRepository.find({
    select: ['appId', 'appName'],
    where: {
      ...queryOptions,
    },
  });

  return res.status(OK).json({
    success: true,
    data: {
      list: apps,
    },
  });
});

/******************************************************************************
 *            获取应用分支列表 - "POST/def/app/getAppBranches"
 ******************************************************************************/

router.post('/getAppBranches', async (req: Request, res: Response) => {
  const { appId } = req.body;

  if (!appId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne({
    appId,
  });

  const list = [
    {
      branchId: 1,
      branchName: 'daily/1.0.1',
    },
    {
      branchId: 2,
      branchName: 'daily/1.0.2',
    },
    {
      branchId: 3,
      branchName: 'daily/1.0.3',
    },
    {
      branchId: 4,
      branchName: 'daily/1.0.4',
    },
  ];

  return res.status(OK).json({
    success: true,
    data: {
      list,
    },
  });
});

/******************************************************************************
 *                      新建应用 - "POST/def/app/createApp"
 ******************************************************************************/

router.post('/createApp', async (req: Request, res: Response) => {
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
 *            获取应用基本信息 - "POST/def/app/getAppBasicInfo"
 ******************************************************************************/

router.post('/getAppBasicInfo', async (req: Request, res: Response) => {
  const { userId, appId } = req.body;

  if (!(userId && appId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne(
    {
      appId,
    },
    {
      relations: ['creator', 'members', 'publishType', 'productType'],
    }
  );

  return res.status(OK).json({
    success: true,
    data: {
      ...app,
    },
  });
});

/******************************************************************************
 *            添加应用成员 - "POST/def/app/addAppMember"
 ******************************************************************************/

router.post('/addAppMember', async (req: Request, res: Response) => {
  const { appId, userName, useTime, role } = req.body;

  if (!(appId && userName && useTime && role)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne({
    appId,
  });
  const memberRole = await memberRoleRepository.findOne({
    code: role,
  });
  const user = await userRepository.findOne({
    userName,
  });

  const member = memberRepository.create({
    joinTime: new Date().getTime(),
    endTime: new Date().getTime() + parseInt(useTime || ''),
    role: memberRole,
    app,
    user,
  });

  await memberRepository.save(member);

  return res.status(OK).json({
    success: true,
  });
});
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
