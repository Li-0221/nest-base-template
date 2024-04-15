// 获取 req 上的 user

// 示例：
// @Post()
// @ApiOperation({ summary: '创建标签' })
// create(@User() user: User, @Body() createTagDto: CreateTagDto) {
//   return this.tagService.create(user.id, createTagDto);
// }

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from '@prisma/client';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserType;
  },
);
