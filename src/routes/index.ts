import { Router } from 'express';
import UserRouter from './User';
import AuthRouter from './Auth';
import AppRouter from './App';
import IterationRouter from './Iteration';
import ConstantsRouter from './Constants';
import MemberRouter from './Member';
import SettingRouter from './Setting';
import DynamicRouter from './Dynamic';
import PublishRouter from './Publish';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);
router.use('/app', AppRouter);
router.use('/iteration', IterationRouter);
router.use('/constants', ConstantsRouter);
router.use('/member', MemberRouter);
router.use('/setting', SettingRouter);
router.use('/dynamic', DynamicRouter);
router.use('/publish', PublishRouter);

// Export the base-router
export default router;
