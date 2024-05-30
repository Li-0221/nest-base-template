import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({ description: '今日收入' })
  today: number;

  @ApiProperty({ description: '历史输入' })
  history: number;
}
