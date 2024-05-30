import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateSoftwareDto {
  @IsString()
  @ApiProperty({ description: '名称' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'url' })
  url: string;

  @IsString()
  @ApiProperty({ description: '图片' })
  image: string;

  @IsString()
  @ApiProperty({ description: '描述' })
  desc: string;

  @IsString()
  @ApiProperty({ description: '详情' })
  detail: string;

  @IsUUID()
  @ApiProperty({ description: '软件类型id' })
  softwareTypeId: string;
}
