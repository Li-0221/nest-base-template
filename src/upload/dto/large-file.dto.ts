import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LargeFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '切片',
  })
  file: Blob;

  @IsString()
  @ApiProperty({ description: '切片名称' })
  name: string;
}
