import { Tag } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TagDto implements Tag {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '图标名称' })
  name: string;

  @ApiProperty({ description: '图标' })
  icon: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '用户id' })
  userId: string;
}
