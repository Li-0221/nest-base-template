import { UserDto } from '@/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Finance } from '@prisma/client';

export class FinanceDto implements Finance {
  @ApiProperty({ description: '交易id' })
  id: string;

  @ApiProperty({ description: '交易金额' })
  amount: number;

  @ApiProperty({ description: '交易日期' })
  createdAt: Date;

  @ApiProperty({ description: '交易id' })
  userId: string;

  @ApiProperty({ description: '用户信息' })
  user: UserDto;
}
