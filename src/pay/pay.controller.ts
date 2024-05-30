import { Controller, Body, Post } from '@nestjs/common';
import { PayService } from './pay.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorator/auth.decorator';

@Controller('pay')
@ApiBearerAuth()
@ApiTags('支付')
export class PayController {
  constructor(private readonly payService: PayService) {}
  // Appid:201906134378
  // 密钥:bc0f8204e0dd8f9c46bc8eb0bf91cbb1
  // 支付网关：https://api.xunhupay.com/payment/do.html
  // 商户号：1605230821

  // https://admin.xunhupay.com/employees/app/index
  // 账号 100968016@qq.com
  // 密码  tab888888

  @Post('payurl')
  @ApiOperation({ summary: '获取支付二维码' })
  qrcode(@Body('id') id: string) {
    return this.payService.getQRcode(id);
  }

  @Public()
  @Post('wxnotify')
  @ApiBody({ type: String })
  @ApiOperation({ summary: '给虎皮椒用的回调通知' })
  wxnotify(@Body() body: any) {
    return this.payService.wxnotify(body);
  }

  @Post('usernotify')
  @ApiOperation({ summary: '通知用户充值成功' })
  usernotify(@Body('id') id: string) {
    return this.payService.usernotify(id);
  }
}
