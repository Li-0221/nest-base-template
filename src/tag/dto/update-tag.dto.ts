import { PartialType } from '@nestjs/swagger';
import { CreateTagDto } from './create-tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({ description: '标签id' })
  id: string;
}
