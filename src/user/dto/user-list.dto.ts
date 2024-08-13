import { UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '名称', required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '电话', required: false })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '角色',
    enum: UserRole,
    enumName: 'Role',
    required: false,
  })
  role?: UserRole;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @IsString({ each: true }) // 验证数组中每个元素是字符串
  @ApiProperty({ description: '最后登陆时间', required: false })
  lastLoginAt?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '状态',
    enum: UserStatus,
    enumName: 'UserStatus',
    required: false,
  })
  status?: UserStatus;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间', required: false })
  createdAt?: string[];
}
