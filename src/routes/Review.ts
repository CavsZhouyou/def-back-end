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
} from '@shared/repositories';
import { Member } from '@entity/Member';
import { asyncForEach, addDynamic } from 'src/utils';
import { Publish } from '@entity/Publish';

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
  const { appId, publishId, reviewTitle, reviewerId, userId } = req.body;

  if (!(appId && publishId && reviewTitle && reviewerId && userId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const publish = await publishRepository.findOne({
    publishId,
  });

  const reviewer = await userRepository.findOne({
    userId: reviewerId,
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

  // 添加动态信息
  const content = `创建了代码审阅 ${reviewTitle} - 审阅人：${reviewer.userName}`;
  addDynamic(userId, appId, content);

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

  const app = await appRepository.findOne(
    {
      appId,
    },
    {
      relations: ['publishes'],
    }
  );

  let reviewList: any[] = [];
  let publishes: Publish[] = [];
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = ['creator', 'reviewer', 'reviewStatus', 'publish'];
  const { appName } = app;

  if (app.publishes && app.publishes.length >= 1) {
    publishes = await publishRepository.find({
      where: app.publishes,
      relations: ['iteration', 'review'],
    });
  }

  publishes.forEach((item) => {
    if (item.review) {
      reviewList.push(item.review);
    }
  });

  if (reviewList.length >= 1) {
    reviewList = await reviewRepository.find({
      where: reviewList,
      relations,
      order: {
        createTime: 'DESC',
      },
    });
  }

  total = reviewList.length;

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + pageSize < total;

    if (hasMore) {
      reviewList = reviewList.splice(dataStart, pageSize);
    } else {
      reviewList = reviewList.splice(dataStart);
    }
  }

  const formattedReviewList: any[] = [];

  await asyncForEach(reviewList, async (item) => {
    const {
      reviewId,
      createTime,
      reviewTitle,
      failReason,
      creator,
      reviewer,
      reviewStatus,
    } = item;
    const publish = await publishRepository.findOne(
      {
        publishId: item.publish.publishId,
      },
      {
        relations: ['iteration'],
      }
    );
    const { iterationId, iterationName, version } = publish.iteration;

    formattedReviewList.push({
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
  });

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      list: formattedReviewList,
    },
  });
});

/******************************************************************************
 *            代码审阅 - "POST/def/review/reviewPublish"
 ******************************************************************************/

router.post('/reviewPublish', async (req: Request, res: Response) => {
  const { appId, userId, reviewId, reviewResult, failReason } = req.body;

  if (!(appId && userId && reviewId && reviewResult)) {
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

  // 添加动态信息
  const content = `${reviewResult === '7001' ? '通过了' : '未通过'}代码审阅 ${
    review.reviewTitle
  }`;
  addDynamic(userId, appId, content);

  return res.status(OK).json({
    success: true,
  });
});
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
