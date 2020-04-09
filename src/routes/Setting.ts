import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  codeReviewSettingRepository,
  reviewerScopeTypeRepository,
} from '@shared/repositories';
import { addDynamic } from 'src/utils';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            获取代码审阅设置 - "POST/def/setting/getCodeReviewSetting"
 ******************************************************************************/

router.post('/getCodeReviewSetting', async (req: Request, res: Response) => {
  const { appId } = req.body;

  if (!appId) {
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
      relations: ['codeReviewSetting'],
    }
  );

  const codeReviewSetting = await codeReviewSettingRepository.findOne(
    {
      id: app.codeReviewSetting.id,
    },
    {
      relations: ['reviewerScope'],
    }
  );

  const { isOpen, reviewerScope } = codeReviewSetting;
  const { code } = reviewerScope;

  return res.status(OK).json({
    success: true,
    data: {
      isOpen,
      reviewerScope: code,
    },
  });
});

/******************************************************************************
 *            修改代码审阅设置 - "POST/def/setting/editCodeReviewSetting"
 ******************************************************************************/

router.post('/editCodeReviewSetting', async (req: Request, res: Response) => {
  const { appId, isOpen, userId, reviewerScope: reviewerScopeCode } = req.body;

  if (!(appId && isOpen !== undefined && userId && reviewerScopeCode)) {
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
      relations: ['codeReviewSetting'],
    }
  );

  const codeReviewSetting = await codeReviewSettingRepository.findOne(
    {
      id: app.codeReviewSetting.id,
    },
    {
      relations: ['reviewerScope'],
    }
  );

  const reviewerScope = await reviewerScopeTypeRepository.findOne({
    code: reviewerScopeCode,
  });

  // 添加应用动态
  if (codeReviewSetting.isOpen !== isOpen) {
    const content = `${isOpen ? '开启' : '关闭'}了代码审阅`;
    await addDynamic(userId, appId, content);
  } else if (
    isOpen &&
    codeReviewSetting.reviewerScope.code !== reviewerScopeCode
  ) {
    const content = `修改代码审阅可选审阅人范围为 ${reviewerScope.name}`;
    await addDynamic(userId, appId, content);
  }

  // 保存设置
  codeReviewSetting.isOpen = isOpen;
  codeReviewSetting.reviewerScope = reviewerScope;

  await codeReviewSettingRepository.save(codeReviewSetting);

  return res.status(OK).json({
    success: true,
  });
});
/***
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
