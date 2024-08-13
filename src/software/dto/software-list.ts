import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class SoftwareListDto extends PaginationDto {
  @IsOptional() //可选字段
  @IsString()
  @ApiProperty({ description: '标题', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '类型', required: false })
  softwareTypeId?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间', required: false })
  createdAt?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '更新时间', required: false })
  updatedAt?: string[];
}
