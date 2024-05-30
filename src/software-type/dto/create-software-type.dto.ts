import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSoftwareTypeDto {
  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;
}
