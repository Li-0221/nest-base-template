import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerBehindProxyGuard } from '@/common/guard/throttler-behind-proxy.guard';
import { Public } from './common/decorator/auth.decorator';

@Controller()
@UseGuards(ThrottlerBehindProxyGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
