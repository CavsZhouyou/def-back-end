import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';

import {
  departmentRepository,
  postRepository,
  userRoleRepository,
  publishTypeRepository,
  productTypeRepository,
} from '@shared/repositories';
import { loginMW } from './middleware';

// Init shared
const router = Router().use(loginMW);

router.get('/getDepartmentList', async (req: Request, res: Response) => {
  const departmentList = await departmentRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: departmentList,
    },
  });
});

router.get('/getPostList', async (req: Request, res: Response) => {
  const postList = await postRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: postList,
    },
  });
});

router.get('/getUserRoleList', async (req: Request, res: Response) => {
  const userRoleList = await userRoleRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: userRoleList,
    },
  });
});

router.get('/getProductTypeList', async (req: Request, res: Response) => {
  const productTypes = await productTypeRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: productTypes,
    },
  });
});

router.get('/getPublishTypeList', async (req: Request, res: Response) => {
  const publishTypes = await publishTypeRepository.find();

  return res.status(OK).json({
    success: true,
    data: {
      list: publishTypes,
    },
  });
});
export default router;
