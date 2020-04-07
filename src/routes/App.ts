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
import { User } from '@entity/User';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *                      获取应用列表 - "POST/def/user/getAppList"
 ******************************************************************************/

router.post('/getAppList', async (req: Request, res: Response) => {
  const { userName, page, pageSize } = req.body;

  if (!(page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  // let users: User[] = [];
  // let hasMore = true;
  // let total = 0;
  // const dataStart = (page - 1) * pageSize;
  // const relations = ['department', 'post', 'role'];

  // // 用户列表查询
  // if (!userName) {
  //   users = await userRepository.find({
  //     relations,
  //   });
  //   total = users.length;

  //   if (dataStart > total) {
  //     return res.status(OK).json({
  //       success: false,
  //       message: '超出用户数据范围！',
  //     });
  //   } else {
  //     hasMore = dataStart + pageSize < total;

  //     if (hasMore) {
  //       users = users.slice(dataStart, pageSize);
  //     } else {
  //       users = users.slice(dataStart);
  //     }
  //   }
  // } else {
  //   // 单独用户查询
  //   const user = await userRepository.findOne(
  //     { userName },
  //     {
  //       relations,
  //     }
  //   );

  //   if (user) {
  //     users = [user];
  //     total = 1;
  //   } else {
  //     users = [];
  //   }

  //   hasMore = false;
  // }

  return res.status(OK).json({
    success: true,
    data: {
      list: [],
      // page,
      // pageSize,
      // hasMore,
      // total,
      // list: users,
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

  const appLogo =
    'https://cavszhouyou-1254093697.cos.ap-chongqing.myqcloud.com/html_logo.png';
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
  const productType = await productTypeRepository.findOne({
    code: productTypeId,
  });

  const app = appRepository.create({
    appName,
    description,
    appLogo,
    repository,
    onlineAddress,
    pagePrefix,
    codeReviewSetting,
    creator,
    publishType,
    productType,
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
