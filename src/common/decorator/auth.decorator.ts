// 声明当前路由不需要token验证
// 示例：
// @Public() 对控制器和单个路由都可以

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
