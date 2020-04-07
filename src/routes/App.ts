import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import { userRepository } from '@shared/repositories';
import { User } from '@entity/User';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *                      获取应用列表 - "POST/api/user/getAppList"
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
 *                                 Export Router
 ******************************************************************************/

export default router;
