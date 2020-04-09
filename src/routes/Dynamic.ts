import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  appRepository,
  userRepository,
  dynamicRepository,
  memberRepository,
} from '@shared/repositories';
import { Dynamic } from '@entity/Dynamic';
import { Member } from '@entity/Member';
import { App } from '@entity/App';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            获取应用动态列表 - "POST/def/dynamic/getDynamicList"
 ******************************************************************************/

router.post('/getDynamicList', async (req: Request, res: Response) => {
  const { appId, userId, count, loadedCount } = req.body;

  if (!(userId && count && loadedCount >= 0)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  let dynamics: Dynamic[] = [];
  let hasMore = true;
  let total = 0;
  const dataStart = loadedCount;

  // 查询单独仓库的动态列表
  if (appId) {
    const app = await appRepository.findOne({
      appId,
    });
    dynamics = await dynamicRepository.find({
      where: { app },
      relations: ['creator', 'app'],
      order: {
        operateTime: 'DESC',
      },
    });
    total = dynamics.length;
  } else if (userId) {
    // 查询用户关联仓库的动态列表
    const user = await userRepository.findOne(
      {
        userId,
      },
      {
        relations: ['joinedApps'],
      }
    );
    let { joinedApps } = user;
    const apps: App[] = [];

    joinedApps.map(async (item: Member) => {
      const member = await memberRepository.findOne(
        {
          ...item,
        },
        {
          relations: ['app'],
        }
      );

      apps.push(member.app);
    });

    dynamics = await dynamicRepository.find({
      where: apps,
      relations: ['creator', 'app'],
      order: {
        operateTime: 'DESC',
      },
    });
  }

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + count < total;

    if (hasMore) {
      dynamics = dynamics.slice(dataStart, count);
    } else {
      dynamics = dynamics.slice(dataStart);
    }
  }

  // 参数提取
  const formattedDynamics = dynamics.map((item: Dynamic) => {
    const { dynamicId, creator, app, operateTime, content } = item;
    const { userAvatar, userName } = creator;
    const { appName } = app;

    return {
      dynamicId,
      userName,
      userAvatar,
      content,
      operateTime,
      appName,
    };
  });

  return res.status(OK).json({
    success: true,
    data: {
      list: formattedDynamics,
    },
  });
});

/***
/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
