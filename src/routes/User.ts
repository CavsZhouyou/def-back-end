import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { adminMW } from './middleware';
import { userRepository } from '@shared/repositories';

// Init shared
const router = Router().use(adminMW);

/******************************************************************************
 *                      Get All Users - "POST /api/users/getUserList"
 ******************************************************************************/

router.post('/getUserList', async (req: Request, res: Response) => {
  const { userName, page, pageSize } = req.body;

  if (!(page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError
    });
  }

  const users = await userRepository.find({
    relations: ['department', 'post']
  });

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore: false,
      total: users.length,
      list: users
    }
  });
});

export default router;
