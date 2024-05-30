import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateRecordDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @ApiProperty({ description: '时间' })
  time: Date;

  @IsString()
  @ApiProperty({ description: '详情' })
  detail: string;
}
