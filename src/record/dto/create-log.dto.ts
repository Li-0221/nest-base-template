import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @ApiProperty({ description: '时间' })
  time: Date;

  @IsString()
  @ApiProperty({ description: '详情' })
  detail: string;
}
