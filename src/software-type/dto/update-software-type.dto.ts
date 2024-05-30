import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UpdateSoftwareTypeDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;

  @IsString()
  @ApiProperty({ description: '名称' })
  name: string;
}
