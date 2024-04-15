import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// 响应里面没有password 就没写 implements
// class UserEntity implements User
export class UserDto {
  @ApiProperty({ description: '用户id' })
  id: string;

  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '角色', enum: Role, enumName: 'Role' })
  role: Role;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
