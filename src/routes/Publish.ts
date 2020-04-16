import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  iterationRepository,
  userRepository,
  publishEnvironmentRepository,
  publishStatusRepository,
  logRepository,
  publishRepository,
  reviewRepository,
  publishTypeRepository,
  iterationStatusRepository,
} from '@shared/repositories';
import { Iteration } from '@entity/Iteration';
import { Publish } from '@entity/Publish';
import { addDynamic } from 'src/utils';

// Init shared
// const router = Router().use(loginMW);
const router = Router();

/******************************************************************************
 *            创建发布 - "POST/def/publish/createPublish"
 ******************************************************************************/

router.post('/createPublish', async (req: Request, res: Response) => {
  const { branch, userId, appName, commit, publishEnv } = req.body;

  if (!(branch && userId && appName && commit && publishEnv)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne(
    {
      appName,
    },
    {
      relations: ['iterations'],
    }
  );

  if (!app) {
    return res.status(OK).json({
      success: false,
      message: '应用不存在！',
    });
  }

  const publisher = await userRepository.findOne({
    userId,
  });

  if (!publisher) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  const publishEnvironment = await publishEnvironmentRepository.findOne({
    code: publishEnv,
  });

  // 判断发布是否存在
  const publish = await publishRepository.findOne(
    {
      commit,
      publishEnvironment,
    },
    {
      relations: ['publishStatus', 'review', 'iteration'],
    }
  );

  if (publish) {
    // 判断迭代状态
    const iteration = await iterationRepository.findOne(
      {
        iterationId: publish.iteration.iterationId,
      },
      {
        relations: ['iterationStatus'],
      }
    );
    const { iterationStatus } = iteration;
    switch (iterationStatus.code) {
      case '3001':
        return res.status(OK).json({
          success: false,
          message: '该迭代已完成，分支不能发布！',
        });
      case '3003':
        return res.status(OK).json({
          success: false,
          message: '该迭代已废弃，分支不能发布！',
        });
      default:
        break;
    }

    switch (publish.publishStatus.code) {
      case '4003':
        const review = await reviewRepository.findOne(
          {
            ...publish.review,
          },
          {
            relations: ['reviewStatus'],
          }
        );
        switch (review.reviewStatus.code) {
          case '7001':
            // 提交发布任务
            return res.status(OK).json({
              success: true,
              data: {
                publishId: publish.publishId,
                repository: app.repository + '.git',
              },
            });
          case '7002':
            return res.status(OK).json({
              success: false,
              message: '代码审核未通过，分支不能发布！',
            });
          default:
            return res.status(OK).json({
              success: false,
              message: '代码审核中，分支不能发布！',
            });
        }
      case '4002':
        // 提交发布任务
        return res.status(OK).json({
          success: true,
          data: {
            publishId: publish.publishId,
            repository: app.repository + '.git',
          },
        });
      default:
        return res.status(OK).json({
          success: false,
          message: '该 commit 已经发布！',
        });
    }
  } else {
    const iterations = await iterationRepository.find({
      where: app.iterations,
    });

    const iteration = iterations.filter(
      (item: Iteration) => item.branch === branch
    )[0];
    const createTime = new Date().getTime();
    const log = logRepository.create({
      content: '无',
    });

    if (publishEnv === 'online') {
      const publishStatus = await publishStatusRepository.findOne({
        code: '4003',
      });
      const savedPublish = publishRepository.create({
        createTime,
        commit,
        log,
        publishEnvironment,
        publishStatus,
        publisher,
        iteration,
        app,
      });

      await publishRepository.save(savedPublish);

      // 添加动态信息
      const content = `创建了分支 ${iteration.iterationName} 的${publishEnvironment.name}发布 ${commit}`;
      addDynamic(userId, app.appId, content);

      return res.status(OK).json({
        success: false,
        message: '该迭代未经过代码审阅，请创建代码审阅后发布到线上环境！',
      });
    } else {
      const publishStatus = await publishStatusRepository.findOne({
        code: '4004',
      });
      const savedPublish = publishRepository.create({
        createTime,
        commit,
        log,
        publishEnvironment,
        publishStatus,
        publisher,
        iteration,
        app,
      });

      await publishRepository.save(savedPublish);

      // 添加动态信息
      const content = `创建了分支 ${iteration.iterationName} 的${publishEnvironment.name}发布 ${commit}`;
      addDynamic(userId, app.appId, content);

      // 提交发布任务
      return res.status(OK).json({
        success: true,
        data: {
          publishId: savedPublish.publishId,
          repository: app.repository + '.git',
        },
      });
    }
  }
});

/******************************************************************************
 *            获取发布列表 - "POST/def/publish/getAppPublishList"
 ******************************************************************************/
router.post('/getAppPublishList', async (req: Request, res: Response) => {
  const {
    appId,
    iterationId,
    publishEnv,
    publishStatus,
    publisherId,
    page,
    pageSize,
  } = req.body;

  if (!(appId && publishEnv && publishStatus && page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let publishes: Publish[] = [];
  let queryOptions: any = {};
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = [
    'publishEnvironment',
    'publishStatus',
    'iteration',
    'publisher',
    'app',
  ];

  // 查询参数初始化
  queryOptions.app = await appRepository.findOne({
    appId,
  });

  if (iterationId)
    queryOptions.iteration = await iterationRepository.findOne({
      iterationId,
    });
  if (publisherId && publisherId.length >= 1)
    queryOptions.publisher = await userRepository.findOne({
      userId: publisherId[0],
    });
  if (publishStatus && publishStatus.length >= 1)
    queryOptions.publishStatus = await publishStatusRepository.findOne({
      code: publishStatus[0],
    });
  if (publishEnv && publishEnv.length >= 1)
    queryOptions.publishEnvironment = await publishEnvironmentRepository.findOne(
      {
        code: publishEnv[0],
      }
    );

  // 发布列表查询
  publishes = await publishRepository.find({
    where: {
      ...queryOptions,
    },
    relations,
    order: {
      createTime: 'DESC',
    },
  });
  total = publishes.length;

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + pageSize < total;

    if (hasMore) {
      publishes = publishes.splice(dataStart, pageSize);
    } else {
      publishes = publishes.splice(dataStart);
    }
  }

  const formattedPublishes: any[] = [];

  publishes.forEach((item: Publish) => {
    const {
      publishId,
      createTime,
      app,
      iteration,
      publisher,
      commit,
      publishEnvironment,
      publishStatus,
    } = item;

    const { appId, appName } = app;
    const { iterationId, iterationName, version } = iteration;
    const { userName, userAvatar } = publisher;

    formattedPublishes.push({
      publishId,
      createTime,
      appId,
      appName,
      iterationName,
      iterationId,
      version,
      publisher: userName,
      publisherAvatar: userAvatar,
      commit,
      publishEnv: publishEnvironment.code,
      publishStatus: publishStatus.code,
    });
  });

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      list: formattedPublishes,
    },
  });
});

/******************************************************************************
 *            获取发布详情 - "POST/def/publish/getAppPublishDetail"
 ******************************************************************************/
router.post('/getAppPublishDetail', async (req: Request, res: Response) => {
  const { publishId } = req.body;

  if (!publishId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const publish = await publishRepository.findOne(
    {
      publishId,
    },
    {
      relations: [
        'publishEnvironment',
        'publishStatus',
        'iteration',
        'publisher',
        'review',
      ],
    }
  );

  const {
    createTime,
    publisher,
    commit,
    publishEnvironment,
    publishStatus,
    review,
  } = publish;

  const { userId, userName, userAvatar } = publisher;
  const completeReview = review
    ? await reviewRepository.findOne(
        {
          ...review,
        },
        {
          relations: ['reviewStatus'],
        }
      )
    : null;

  const publishDetail: any = {
    publishId,
    publisherId: userId,
    publisher: userName,
    publisherAvatar: userAvatar,
    commit,
    createTime,
    publishEnv: publishEnvironment.code,
    publishStatus: publishStatus.code,
  };

  if (completeReview) {
    const {
      reviewId,
      reviewStatus: { code: reviewStatus },
      failReason,
    } = completeReview;

    publishDetail.reviewId = reviewId;
    publishDetail.reviewStatus = reviewStatus;
    publishDetail.failReason = failReason;
  }

  return res.status(OK).json({
    success: true,
    data: publishDetail,
  });
});

/******************************************************************************
 *            获取发布日志 - "POST/def/publish/getAppPublishLog"
 ******************************************************************************/
router.post('/getAppPublishLog', async (req: Request, res: Response) => {
  const { publishId } = req.body;

  if (!publishId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const publish = await publishRepository.findOne(
    {
      publishId,
    },
    {
      relations: ['log'],
    }
  );

  const { log } = publish;

  return res.status(OK).json({
    success: true,
    data: {
      log: log.content,
    },
  });
});

/******************************************************************************
 *           更新发布信息 - "POST/def/publish/updateAppPublishInfo"
 ******************************************************************************/
router.post('/updateAppPublishInfo', async (req: Request, res: Response) => {
  const { publishId, publishLog, publishStatus: publishStatusCode } = req.body;

  if (!publishId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const publish = await publishRepository.findOne(
    {
      publishId,
    },
    {
      relations: ['log', 'publishStatus', 'iteration', 'publishEnvironment'],
    }
  );

  const { log, publishEnvironment } = publish;

  // log 信息更新
  log.content = publishLog;

  const publishStatus = await publishStatusRepository.findOne({
    code: publishStatusCode,
  });
  publish.publishStatus = publishStatus;

  await publishRepository.save(publish);

  // 线上发布成功时，将迭代状态置为已完成
  if (publishEnvironment.code === 'online' && publishStatusCode === '4001') {
    const iteration = await iterationRepository.findOne(
      {
        iterationId: publish.iteration.iterationId,
      },
      {
        relations: ['iterationStatus'],
      }
    );

    const iterationStatus = await iterationStatusRepository.findOne({
      code: '3001',
    });

    iteration.iterationStatus = iterationStatus;

    await iterationRepository.save(iteration);
  }

  return res.status(OK).json({
    success: true,
  });
});
/***
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
