import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { paramMissingError } from '@shared/constants';
import { loginMW } from './middleware';
import {
  userRepository,
  appRepository,
  memberRoleRepository,
  memberRepository,
} from '@shared/repositories';
import { Member } from '@entity/Member';

// Init shared
const router = Router().use(loginMW);

/******************************************************************************
 *            获取应用成员列表 - "POST/def/member/getAppMemberList"
 ******************************************************************************/

router.post('/getAppMemberList', async (req: Request, res: Response) => {
  const { appId, page, pageSize } = req.body;

  if (!(appId && page && pageSize)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne({
    appId,
  });

  let members: any[] = [];
  let hasMore = true;
  let total = 0;
  const dataStart = (page - 1) * pageSize;
  const relations = ['role', 'user'];

  // 用户列表查询
  const originMembers = await memberRepository.find({
    where: {
      app,
    },
    relations,
  });
  total = members.length;

  originMembers.forEach((item: Member) => {
    const { user, role, joinTime, expiredTime } = item;
    const { userId, userName, userAvatar } = user;

    if (
      parseInt(expiredTime) > new Date().getTime() ||
      expiredTime === '9999' // 创建者
    ) {
      members.push({
        userId,
        userName,
        userAvatar,
        role,
        joinTime,
        expiredTime,
      });
    }
  });

  if (dataStart > total) {
    return res.status(OK).json({
      success: false,
      message: '超出数据范围！',
    });
  } else {
    hasMore = dataStart + pageSize < total;

    if (hasMore) {
      members = members.splice(dataStart, pageSize);
    } else {
      members = members.splice(dataStart);
    }
  }

  return res.status(OK).json({
    success: true,
    data: {
      page,
      pageSize,
      hasMore,
      total,
      list: members,
    },
  });
});

/******************************************************************************
 *            获取应用成员列表(option) - "POST/def/member/getAppMemberOptions"
 ******************************************************************************/

router.post('/getAppMemberOptions', async (req: Request, res: Response) => {
  const { appId } = req.body;

  if (!appId) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const app = await appRepository.findOne({
    appId,
  });

  let members: any[] = [];
  const relations = ['user'];

  // 用户列表查询
  const originMembers = await memberRepository.find({
    where: {
      app,
    },
    relations,
  });

  originMembers.forEach((item: Member) => {
    const { user, role, joinTime, expiredTime } = item;
    const { userId, userName, userAvatar } = user;

    if (
      parseInt(expiredTime) > new Date().getTime() ||
      expiredTime === '9999' // 创建者
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
 *            添加应用成员 - "POST/def/member/addAppMember"
 ******************************************************************************/

router.post('/addAppMember', async (req: Request, res: Response) => {
  const { appId, userName, useTime, role } = req.body;

  if (!(appId && userName && useTime && role)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({
    userName,
  });

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  const app = await appRepository.findOne({
    appId,
  });
  const memberRole = await memberRoleRepository.findOne({
    roleId: role,
  });
  const member = await memberRepository.findOne({
    app,
    user,
  });

  if (member) {
    // 判断用户是否存在，且权限是否过期
    if (parseInt(member.expiredTime) >= new Date().getTime()) {
      return res.status(OK).json({
        success: false,
        message: '该用户已经加入应用！',
      });
    } else {
      member.role = memberRole;
      member.expiredTime = new Date().getTime() + parseInt(useTime || '');
      await memberRepository.save(member);
    }
  } else {
    // 新用户第一次添加
    const savedMember = memberRepository.create({
      joinTime: new Date().getTime(),
      expiredTime: new Date().getTime() + parseInt(useTime || ''),
      role: memberRole,
      app,
      user,
    });

    await memberRepository.save(savedMember);
  }

  return res.status(OK).json({
    success: true,
  });
});

/******************************************************************************
 *            修改应用成员权限 - "POST/def/member/changeMemberRights"
 ******************************************************************************/

router.post('/changeMemberRights', async (req: Request, res: Response) => {
  const { appId, userId, useTime, role } = req.body;

  if (!(appId && userId && useTime && role)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({
    userId,
  });

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  const app = await appRepository.findOne({
    appId,
  });
  const member = await memberRepository.findOne({
    app,
    user,
  });

  if (!member) {
    return res.status(OK).json({
      success: false,
      message: '成员不存在！',
    });
  }

  const memberRole = await memberRoleRepository.findOne({
    roleId: role,
  });

  member.role = memberRole;
  member.expiredTime = new Date().getTime() + parseInt(useTime || '');
  await memberRepository.save(member);

  return res.status(OK).json({
    success: true,
  });
});

/******************************************************************************
 *            删除应用成员 - "POST/def/member/deleteAppMember"
 ******************************************************************************/

router.post('/deleteAppMember', async (req: Request, res: Response) => {
  const { appId, userId } = req.body;

  if (!(appId && userId)) {
    return res.status(OK).json({
      success: false,
      message: paramMissingError,
    });
  }

  const user = await userRepository.findOne({
    userId,
  });

  if (!user) {
    return res.status(OK).json({
      success: false,
      message: '用户不存在！',
    });
  }

  const app = await appRepository.findOne({
    appId,
  });
  const member = await memberRepository.findOne({
    app,
    user,
  });

  if (!member) {
    return res.status(OK).json({
      success: false,
      message: '成员不存在！',
    });
  }

  member.expiredTime = new Date().getTime();
  await memberRepository.save(member);

  return res.status(OK).json({
    success: true,
  });
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
