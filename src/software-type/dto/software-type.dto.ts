import { ApiProperty } from '@nestjs/swagger';
import { SoftwareType } from '@prisma/client';

export class SoftWareTypeDto implements SoftwareType {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
