import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';

@Module({
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule {}
