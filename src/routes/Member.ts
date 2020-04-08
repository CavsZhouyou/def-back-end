import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  userRepository,
  appRepository,
  memberRoleRepository,
  memberRepository,
} from '@shared/repositories';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            添加应用成员 - "POST/def/member/addAppMember"
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

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在',
    });
  }

  const member = memberRepository.create({
    joinTime: new Date().getTime(),
    expiredTime: new Date().getTime() + parseInt(useTime || ''),
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
