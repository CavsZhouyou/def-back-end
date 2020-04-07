import { Router } from 'express';
import UserRouter from './User';
import AuthRouter from './Auth';
import AppRouter from './App';
import ConstantsRouter from './Constants';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);
router.use('/app', AppRouter);
router.use('/constants', ConstantsRouter);

// Export the base-router
export default router;
