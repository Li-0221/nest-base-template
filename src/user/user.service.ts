import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { UserListDto } from "./dto/user-list.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import dayjs from "dayjs";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async find(userListDto: UserListDto) {
    const { pageNum, pageSize, lastLoginAt, createdAt, name, phone, role, status } = userListDto;

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
              gte: dayjs(createdAt[0]).startOf("day").toDate(),
              lt: dayjs(createdAt[1]).endOf("day").toDate()
            }
          : undefined,
      lastLoginAt:
        lastLoginAt && lastLoginAt.length === 2 && lastLoginAt[1]
          ? {
              gte: dayjs(lastLoginAt[0]).startOf("day").toDate(),
              lt: dayjs(lastLoginAt[1]).endOf("day").toDate()
            }
          : undefined
    };
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: {
        lastLoginAt: "desc"
      }
    });
    const total = await this.prisma.user.count({ where });
    return { users, total };
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    await this.prisma.user.update({
      where: { id },
      data
    });
    return "操作成功";
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id }
    });
    return "操作成功";
  }
}
