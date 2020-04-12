import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  codeReviewSettingRepository,
  memberRepository,
  publishRepository,
  userRepository,
  reviewStatusRepository,
  reviewRepository,
  iterationRepository,
} from '@shared/repositories';
import { Member } from '@entity/Member';
import app from '@server';
import { asyncForEach } from 'src/utils';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            获取代码审阅人 - "POST/def/review/getReviewerOptions"
 ******************************************************************************/

router.post('/getReviewerOptions', async (req: Request, res: Response) => {
  const { appId, creatorId } = req.body;

  if (!(appId && creatorId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne(
    {
      appId,
    },
    {
      relations: ['codeReviewSetting'],
    }
  );

  const codeReviewSetting = await codeReviewSettingRepository.findOne(
    {
      id: app.codeReviewSetting.id,
    },
    {
      relations: ['reviewerScope'],
    }
  );

  let members: any[] = [];
  let roles: string[] = [];
  const { reviewerScope } = codeReviewSetting;
  const relations = ['user', 'role'];

  switch (reviewerScope.code) {
    case '8001':
      roles = ['5001'];
      break;
    case '8002':
      roles = ['5001', '5002'];
      break;
    default:
      roles = ['5001', '5002', '5003'];
      break;
  }

  // 用户列表查询
  const originMembers = await memberRepository.find({
    where: {
      app,
    },
    relations,
  });

  originMembers.forEach((item: Member) => {
    const { user, expiredTime, role } = item;
    const { userId, userName } = user;

    // 权限过滤
    if (
      (parseInt(expiredTime) > new Date().getTime() ||
        expiredTime === '9999') &&
      roles.indexOf(role.roleId) > -1 &&
      (creatorId !== userId || role.roleId === '5001')
    ) {
      members.push({
        userId,
        userName,
      });
    }
  });

  return res.status(OK).json({
    success: true,
    data: {
      list: members,
    },
  });
});

/******************************************************************************
 *            获取申请代码审阅 - "POST/def/review/applyCodeReview"
 ******************************************************************************/

router.post('/applyCodeReview', async (req: Request, res: Response) => {
  const { publishId, reviewTitle, reviewerId, userId } = req.body;

  if (!(publishId && reviewTitle && reviewerId && userId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const publish = await publishRepository.findOne({
    publishId,
  });

  const reviewer = await userRepository.findOne({
    reviewerId,
  });

  const creator = await userRepository.findOne({
    userId,
  });

  const reviewStatus = await reviewStatusRepository.findOne({
    code: '7003',
  });

  const review = reviewRepository.create({
    reviewTitle,
    createTime: new Date().getTime(),
    creator,
    reviewer,
    reviewStatus,
  });

  publish.review = review;

  await publishRepository.save(publish);

  return res.status(OK).json({
    success: true,
  });
});

/******************************************************************************
 *            获取代码审阅列表 - "POST/def/review/getCodeReviewList"
 ******************************************************************************/

router.post('/getCodeReviewList', async (req: Request, res: Response) => {
  const { appId, page, pageSize } = req.body;

  if (!(appId && page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.find({
    where: {
      appId,
    },
    relations: ['publishes'],
  });

  let reviewList: any[] = [];
  const { appName } = app;

  const publishes = await publishRepository.find({
    where: app.publishes,
    relations: ['iteration', 'review'],
  });

  await asyncForEach(publishes, async (item) => {
    if (item.review) {
      const { iteration } = item;
      const review = await reviewRepository.findOne(
        {
          ...item.review,
        },
        {
          relations: ['creator', 'reviewer', 'reviewStatus'],
        }
      );
      const {
        reviewId,
        createTime,
        reviewTitle,
        failReason,
        creator,
        reviewer,
        reviewStatus,
      } = review;
      const { iterationId, iterationName, version } = iteration;

      reviewList.push({
        reviewId,
        createTime,
        appId,
        appName,
        iterationName,
        iterationId,
        reviewTitle,
        version,
        creator: creator.userName,
        creatorAvatar: creator.userAvatar,
        reviewer: reviewer.userName,
        reviewerAvatar: reviewer.userAvatar,
        reviewerId: reviewer.userId,
        reviewStatus: reviewStatus.code,
        failReason,
      });
    }
  });

  return res.status(OK).json({
    success: true,
    data: {
      list: reviewList,
    },
  });
});
// userId: sessionStorage.getItem('userId') || '',
// reviewId,
// reviewResult: '7002',
// failReason

/******************************************************************************
 *            代码审阅 - "POST/def/review/reviewPublish"
 ******************************************************************************/

router.post('/reviewPublish', async (req: Request, res: Response) => {
  const { userId, reviewId, reviewResult, failReason } = req.body;

  if (!(userId && reviewId && reviewResult)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const reviewStatus = await reviewStatusRepository.findOne({
    code: reviewResult,
  });

  const review = await reviewRepository.findOne({
    reviewId,
  });

  review.reviewStatus = reviewStatus;
  review.failReason = failReason;

  await reviewRepository.save(review);

  return res.status(OK).json({
    success: true,
  });
});
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
