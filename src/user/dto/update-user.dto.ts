import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  @ApiProperty({ description: '用户id' })
  id: string;

  @IsEnum(UserStatus)
  @ApiProperty({ description: '状态', enum: UserStatus })
  status: UserStatus;

  @IsEnum(UserRole)
  @ApiProperty({ description: '身份', enum: UserRole })
  role: UserRole;
}
