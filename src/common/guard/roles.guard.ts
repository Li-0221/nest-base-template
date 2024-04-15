// 使用这个 需要在user表中加一个role字段，因为这里要获取role的值与传入的值进行比较

// @UseGuards(RolesGuard) 可以对单个路由使用，也可以对整个控制器使用
// @Roles(Role.ADMIN) 对单个路由使用

// 示例如下：
// import { RolesGuard } from '@/roles.guard';
// import { Roles } from '@/decorator/roles.decorator';
// @UseGuards(RolesGuard)
// export class CatsController {
//   @Get()
//   @Roles(Role.ADMIN)   // admin能访问
//   findAll() {}
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取 'roles' 元数据
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // 没有设置 'roles' 元数据，直接通过
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // 从请求中获取用户信息
    const user = request.user;

    // 执行授权逻辑，检查用户角色是否符合要求
    const hasRequiredRole = user && requiredRoles.includes(user.role);
    return hasRequiredRole;
  }
}
