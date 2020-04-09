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
} from '@shared/repositories';
import { Iteration } from '@entity/Iteration';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            创建发布 - "POST/def/publish/createPublish"
 ******************************************************************************/

router.post('/createPublish', async (req: Request, res: Response) => {
  const { branch, userId, repository, commit, publishEnv } = req.body;

  if (!(branch && userId && repository && commit && publishEnv)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  // 判断发布是否存在
  const publish = await publishRepository.findOne(
    {
      commit,
    },
    {
      relations: ['publishStatus', 'review'],
    }
  );

  if (publish) {
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
      case '4001':
        // 提交发布任务
        return res.status(OK).json({
          success: true,
          data: {
            publishId: publish.publishId,
          },
        });
      default:
        return res.status(OK).json({
          success: false,
          message: '该commit 已经发布！',
        });
    }
  } else {
    const app = await appRepository.findOne(
      {
        repository,
      },
      {
        relations: ['iterations'],
      }
    );

    const iterations = await iterationRepository.find({
      where: app.iterations,
    });

    const iteration = iterations.filter(
      (item: Iteration) => item.branch === branch
    )[0];
    const createTime = new Date().getTime();
    const publisher = await userRepository.findOne({
      userId,
    });
    const publishEnvironment = await publishEnvironmentRepository.findOne({
      code: publishEnv,
    });
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
      });

      await publishRepository.save(savedPublish);

      return res.status(OK).json({
        success: false,
        data: {
          text: '该迭代未经过代码审阅，请创建代码审阅后发布到线上环境！',
        },
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
      });

      await publishRepository.save(savedPublish);

      // 提交发布任务
      return res.status(OK).json({
        success: true,
        data: {
          publishId: savedPublish.publishId,
        },
      });
    }
  }
});

/***
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
