import { ApiProperty } from '@nestjs/swagger';
import { Software } from '@prisma/client';
import { IsString, IsUUID } from 'class-validator';

export class UpdateSoftwareDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @ApiProperty({ description: '标题' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'url' })
  url: string;

  @IsString()
  @ApiProperty({ description: '简介' })
  desc: string;

  @IsString()
  @ApiProperty({ description: '图片' })
  image: string;

  @IsUUID()
  @ApiProperty({ description: '类型id' })
  softwareTypeId: string;

  @IsString()
  @ApiProperty({ description: '详情' })
  detail: string;
}
