import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { adminMW } from './middleware';
import { userRepository } from '@shared/repositories';
import { User } from '@entity/User';

// Init shared
const router = Router().use(adminMW);

router.post('/getUserList', async (req: Request, res: Response) => {
  const { userName, page, pageSize } = req.body;

  if (!(page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError
    });
  }

  let users: User[] = [];
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;

  // 用户列表查询
  if (!userName) {
    users = await userRepository.find({
      relations: ['department', 'post']
    });
    total = users.length;

    if (dataStart > total) {
      return res.status(OK).json({
        success: false,
        message: '超出用户数据范围！'
      });
    } else {
      users = users.slice(dataStart, pageSize);
      hasMore = dataStart + pageSize < total;
    }
  } else {
    // 单独用户查询
    const user = await userRepository.findOne(
      { userName },
      {
        relations: ['department', 'post']
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
      list: users
    }
  });
});

router.post('/addUser', async (req: Request, res: Response) => {
  const { userName, userId, departmentId, postId } = req.body;

  if (!(userName && userId && departmentId && postId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError
    });
  }

  const user = userRepository.findOne({ userName, userId });

  if (user) {
    return res.status(OK).json({
      success: false,
      message: '用户已存在！'
    });
  }

  return res.status(OK).json({
    success: true,
    data: {}
  });
});
export default router;
