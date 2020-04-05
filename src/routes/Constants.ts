import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';

import { departmentRepository, postRepository } from '@shared/repositories';

const router = Router();

router.get('/getDepartmentList', async (req: Request, res: Response) => {
  const departmentList = await departmentRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: departmentList
    }
  });
});

router.get('/getPostList', async (req: Request, res: Response) => {
  const postList = await postRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: postList
    }
  });
});
export default router;
