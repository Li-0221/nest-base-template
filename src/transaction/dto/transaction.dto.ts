import { Transaction, TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto implements Transaction {
  @ApiProperty({ description: 'id' })
  id: string;

  @ApiProperty({ description: '金额' })
  amount: number;

  @ApiProperty({ description: '类型', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;

  @ApiProperty({ description: '标签id' })
  tagId: string;

  @ApiProperty({ description: '用户id' })
  userId: string;
}
