import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';

import { JwtService } from '@shared/JwtService';
import {
  paramMissingError,
  loginFailedErr,
  cookieProps,
} from '@shared/constants';
import { userRepository } from '@shared/repositories';

const router = Router();
const jwtService = new JwtService();

/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/login', async (req: Request, res: Response) => {
  const { account: userId, password } = req.body;

  if (!(userId && password)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne(
    { userId },
    { relations: ['role'] }
  );
  if (!user) {
    return res.json({
      success: false,
      message: '账号不存在！',
    });
  }

  const pwdPassed = await bcrypt.compare(password, user.pwdHash);
  if (!pwdPassed) {
    return res.status(OK).json({
      success: false,
      message: '密码错误！',
    });
  }

  const jwt = await jwtService.getJwt({
    id: user.id,
    role: user.role.roleId,
  });
  const { key, options } = cookieProps;
  res.cookie(key, jwt, options);

  return res.status(OK).json({
    success: true,
    data: {
      userInfo: {
        ...user,
        userRole: user.role.roleId,
      },
    },
    message: '登录成功!',
  });
});

/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
  const { key, options } = cookieProps;
  res.clearCookie(key, options);
  return res.status(OK).json({
    success: true,
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
