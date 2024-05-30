import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UserListDto } from './dto/user-list.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import dayjs from 'dayjs';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async find(userListDto: UserListDto) {
    const {
      pageNum,
      pageSize,
      lastLoginAt,
      createdAt,
      name,
      phone,
      role,
      status,
    } = userListDto;

    const where = {
      // 模糊匹配字符串 如果是name是''，匹配所有name
      name: { contains: name },
      phone: { contains: phone },
      // 如果传的role是 '',设置成undefined，忽略该条件
      role: role ? role : undefined,
      status: status ? status : undefined,
      createdAt:
        createdAt && createdAt.length === 2 && createdAt[1]
          ? {
              gte: dayjs(createdAt[0]).startOf('day').toDate(),
              lt: dayjs(createdAt[1]).endOf('day').toDate(),
            }
          : undefined,
      lastLoginAt:
        lastLoginAt && lastLoginAt.length === 2 && lastLoginAt[1]
          ? {
              gte: dayjs(lastLoginAt[0]).startOf('day').toDate(),
              lt: dayjs(lastLoginAt[1]).endOf('day').toDate(),
            }
          : undefined,
    };
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        lastLoginAt: 'desc',
      },
    });
    const total = await this.prisma.user.count({ where });
    return { users, total };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    await this.prisma.user.update({
      where: { id },
      data,
    });
    return '操作成功';
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return '操作成功';
  }

  async count({ id }: UserDto, currentToken: string) {
    const { loginCount, lastLoginAt, token } =
      await this.prisma.user.findUnique({
        where: { id },
      });
    if (token && token !== currentToken) {
      return { responseCode: 401, message: '账号已在别处登陆' };
    }
    if (dayjs().isSame(lastLoginAt, 'day')) {
      return '今天已经登录过，本次登录不计次数';
    }
    await this.prisma.user.update({
      where: { id },
      data: { loginCount: loginCount + 1, lastLoginAt: new Date() },
    });
    return '本次登录计入次数';
  }

  async stats(type: 'day' | 'month') {
    const list = [];
    if (type === 'day') {
      const startOfWeek = dayjs().subtract(6, 'day');

      for (let i = 0; i < 7; i++) {
        const date = startOfWeek.add(i, 'day');
        const count = await this.prisma.user.count({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: date.endOf('day').toDate(),
            },
          },
        });
        list.push({ date: date.format('YYYY-MM-DD'), count });
      }
    } else if (type === 'month') {
      const startOfYear = dayjs().subtract(11, 'month').startOf('month');

      for (let i = 0; i < 12; i++) {
        const date = startOfYear.add(i, 'month');
        const nextDate = date.add(1, 'month');

        const count = await this.prisma.user.count({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: nextDate.endOf('day').toDate(),
            },
          },
        });
        list.push({ month: date.format('YYYY-MM'), count });
      }
    }
    return list;
  }
}
