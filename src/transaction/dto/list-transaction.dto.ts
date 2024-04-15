import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ListTransactionDto {
  @IsNumber()
  @ApiProperty({ description: 'pageNum' })
  pageNum: number;

  @IsNumber()
  @ApiProperty({ description: 'pageSize' })
  pageSize: number;

  @IsString()
  @ApiProperty({ description: '标签id' })
  tagId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '开始时间', required: false })
  beginTime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '结束时间', required: false })
  endTime?: string;
}
