import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateSoftwareDto } from './create-software.dto';

export class UpdateSoftwareDto extends CreateSoftwareDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;
}
