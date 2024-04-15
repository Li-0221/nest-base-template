// 为路由加上身份验证

// 示例：
// @Roles(Role.ADMIN) 对单个路由使用

import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
