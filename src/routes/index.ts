import { Router } from 'express';
// import UserRouter from './Users';
import UserRouter from './User';
import AuthRouter from './Auth';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);

// Export the base-router
export default router;
