import { Record } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RecordDto implements Record {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '时间' })
  time: Date;

  @ApiProperty({ description: '详情' })
  detail: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
