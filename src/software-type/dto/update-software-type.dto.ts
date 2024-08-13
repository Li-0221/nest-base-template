import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateSoftwareTypeDto } from './create-software-type.dto';

export class UpdateSoftwareTypeDto extends CreateSoftwareTypeDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;
}
