import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  codeReviewSettingRepository,
} from '@shared/repositories';

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

/***
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
