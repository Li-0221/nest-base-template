import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @Length(1, 8)
  @ApiProperty({ description: '名称(1-8位)' })
  name: string;

  @IsString()
  @ApiProperty({ description: '图标' })
  icon: string;
}
