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
  @ApiProperty({ description: '用户名' })
  name: string;

  @IsString()
  @ApiProperty({ description: '电话' })
  phone: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @ApiProperty({ description: '创建时间' })
  createdAt?: string[];
}
