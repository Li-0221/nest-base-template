import { UserRole, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserListDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '名称' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '电话' })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '角色', enum: UserRole, enumName: 'Role' })
  role?: UserRole;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @IsString({ each: true }) // 验证数组中每个元素是字符串
  @ApiProperty({ description: '最后登陆时间' })
  lastLoginAt?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '状态',
    enum: UserStatus,
    enumName: 'UserStatus',
  })
  status?: UserStatus;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间' })
  createdAt?: string[];
}
