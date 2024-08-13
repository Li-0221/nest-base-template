import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class FinanceListDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '用户名', required: false })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '电话', required: false })
  phone?: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间', required: false })
  createdAt?: string[];
}
