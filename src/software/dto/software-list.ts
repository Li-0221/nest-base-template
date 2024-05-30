import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SoftwareListDto extends PaginationDto {
  @IsOptional() //可选字段
  @IsString()
  @ApiProperty({ description: '标题' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '类型' })
  softwareTypeId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间' })
  createdAt?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '更新时间' })
  updatedAt?: string[];
}
