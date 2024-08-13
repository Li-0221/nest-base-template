import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateRecordDto } from './create-log.dto';

export class UpdateRecordDto extends CreateRecordDto {
  @IsUUID()
  @ApiProperty({ description: 'id' })
  id: string;
}
