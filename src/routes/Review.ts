import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  codeReviewSettingRepository,
  reviewerScopeTypeRepository,
  memberRepository,
} from '@shared/repositories';
import { Member } from '@entity/Member';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            获取代码审阅人 - "POST/def/review/getReviewerOptions"
 ******************************************************************************/

router.post('/getReviewerOptions', async (req: Request, res: Response) => {
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

  let members: any[] = [];
  let roles: string[] = [];
  const { reviewerScope } = codeReviewSetting;
  const relations = ['user', 'role'];

  switch (reviewerScope.code) {
    case '8001':
      roles = ['5001'];
      break;
    case '8002':
      roles = ['5001', '5002'];
      break;
    default:
      roles = ['5001', '5002', '5003'];
      break;
  }

  // 用户列表查询
  const originMembers = await memberRepository.find({
    where: {
      app,
    },
    relations,
  });

  originMembers.forEach((item: Member) => {
    const { user, expiredTime, role } = item;
    const { userId, userName } = user;

    // 权限过滤
    if (
      (parseInt(expiredTime) > new Date().getTime() ||
        expiredTime === '9999') &&
      roles.indexOf(role.roleId) > -1
    ) {
      members.push({
        userId,
        userName,
      });
    }
  });

  return res.status(OK).json({
    success: true,
    data: {
      list: members,
    },
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
