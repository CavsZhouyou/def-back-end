import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import bcrypt from 'bcrypt';
import md5 from 'md5';

import { paramMissingError, pwdSaltRounds } from '@shared/constants';
import { adminMW } from './middleware';
import {
  userRepository,
  userRoleRepository,
  postRepository,
  departmentRepository,
} from '@shared/repositories';
import { User } from '@entity/User';

// Init shared
const router = Router().use(adminMW);

router.post('/getUserList', async (req: Request, res: Response) => {
  const { userName, page, pageSize } = req.body;

  if (!(page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let users: User[] = [];
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = ['department', 'post', 'role'];

  // 用户列表查询
  if (!userName) {
    users = await userRepository.find({
      relations,
    });
    total = users.length;

    if (dataStart > total) {
      return res.status(OK).json({
        success: false,
        message: '超出用户数据范围！',
      });
    } else {
      hasMore = dataStart + pageSize < total;

      if (hasMore) {
        users = users.slice(dataStart, pageSize);
      } else {
        users = users.slice(dataStart);
      }
    }
  } else {
    // 单独用户查询
    const user = await userRepository.findOne(
      { userName },
      {
        relations,
      }
    );

    if (user) {
      users = [user];
      total = 1;
    } else {
      users = [];
    }

    hasMore = false;
  }

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      list: users,
    },
  });
});

router.post('/addUser', async (req: Request, res: Response) => {
  const { userName, userId, departmentId, postId, userRoleId } = req.body;

  if (!(userName && userId && departmentId && postId && userRoleId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({ userId });

  if (user) {
    return res.status(OK).json({
      success: false,
      message: '用户已存在！',
    });
  }

  const post = await postRepository.findOne({ postId });
  const department = await departmentRepository.findOne({ departmentId });
  const role = await userRoleRepository.findOne({ roleId: userRoleId });
  const userAvatar = `http://hd215.api.yesapi.cn/?s=Ext.Avatar.Show&nickname=${userName}&size=500&app_key=4C389AC422864EB57101E24648435351&sign=BCF78D4C895E4054AC0B231BD1DD0524`;
  const pwdHash = bcrypt.hashSync(md5(userId), pwdSaltRounds);

  const newUser = userRepository.create({
    userId,
    userName,
    userAvatar,
    pwdHash,
    post,
    department,
    role,
  });

  await userRepository.insert(newUser);

  return res.status(OK).json({
    success: true,
  });
});

router.post('/deleteUser', async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({ userId });

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  await userRepository.remove(user);

  return res.status(OK).json({
    success: true,
  });
});

router.post('/resetPassword', async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({ userId });

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  user.pwdHash = bcrypt.hashSync(md5(userId), pwdSaltRounds);

  await userRepository.save(user);

  return res.status(OK).json({
    success: true,
  });
});
export default router;
