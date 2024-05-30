import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'pageNum' })
  pageNum: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'pageSize' })
  pageSize: number;
}
