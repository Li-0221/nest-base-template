import { ApiProperty } from '@nestjs/swagger';
import { Software } from '@prisma/client';

export class SoftwareDto implements Software {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '标题' })
  title: string;

  @ApiProperty({ description: 'url' })
  url: string;

  @ApiProperty({ description: '简介' })
  desc: string;

  @ApiProperty({ description: '图片' })
  image: string;

  @ApiProperty({ description: '类型id' })
  softwareTypeId: string;

  @ApiProperty({ description: '详情' })
  detail: string;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
