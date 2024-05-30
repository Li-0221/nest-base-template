import { User, UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto implements Omit<User, 'password' | 'token'> {
  @ApiProperty({ description: '用户id' })
  id: string;

  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '电话' })
  phone: string;

  @ApiProperty({ description: '角色', enum: UserRole, enumName: 'Role' })
  role: UserRole;

  @ApiProperty({ description: '登陆次数' })
  loginCount: number;

  @ApiProperty({ description: '最后登陆时间' })
  lastLoginAt: Date;

  @ApiProperty({
    description: '状态',
    enum: UserStatus,
    enumName: 'UserStatus',
  })
  status: UserStatus;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
