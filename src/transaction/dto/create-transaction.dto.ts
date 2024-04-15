import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @ApiProperty({ description: '金额(支出为负数)' })
  amount: number;

  @IsString()
  @ApiProperty({ description: '类型 （income收入，expense支出）' })
  type: TransactionType;

  @IsString()
  @ApiProperty({ description: '标签id' })
  tagId: string;
}
