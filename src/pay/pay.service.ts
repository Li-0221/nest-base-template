import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import md5 from 'md5';
import axios from 'axios';

function getHash(params: any, appSecret: string) {
  const sortedParams = Object.keys(params)
    .filter((key) => params[key] && key !== 'hash') //过滤掉空值和hash本身
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const stringSignTemp = sortedParams + appSecret;
  const hash = md5(stringSignTemp);
  return hash;
}

@Injectable()
export class PayService {
  constructor(private readonly prisma: PrismaService) {}

  async getQRcode(id: string) {
    const total_fee = 0.01; //金额，最多两位小数
    const params = {
      version: '1.1',
      appid: '201906134378',
      trade_order_id: id, //商户订单号
      total_fee,
      title: '微信支付',
      time: Math.floor(new Date().valueOf() / 1000),
      notify_url: `${process.env.PAY_BACK_URL}pay/wxnotify`, //通知回调网址,直接写一个通知接口,POST请求
      nonce_str:
        Date.now().toString(16).slice(0, 6) +
        '-' +
        Math.random().toString(16).slice(2, 8),
      type: 'WAP',
      wap_url: 'http://www.xunhupay.com',
      wap_name: 'http://www.xunhupay.com',
    };
    const hash = getHash(params, process.env.PAY_KEY);
    try {
      const { data } = await axios.post(
        'https://api.xunhupay.com/payment/do.html',
        // 'https://api.xunhunet.com/payment/do.html',
        { ...params, hash },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      console.log('Response:', data);
      return data;
    } catch (error) {
      console.log(error);
      return { responseCode: 500, message: '支付链接获取失败' };
    }
  }

  async wxnotify(data: any) {
    try {
      //验签
      if (data.hash !== getHash(data, process.env.PAY_KEY)) {
        console.log('验签失败');
        return;
      }
      if (data.status === 'OD') {
        const { trade_order_id: userId, total_fee } = data;
        await this.prisma.user.update({
          where: { id: userId },
          data: { role: 'VIP_USER' },
        });
        const count = await this.prisma.finance.count({ where: { userId } });
        if (!count) {
          await this.prisma.finance.create({
            data: { amount: Number(total_fee), userId },
          });
        }
        console.log('支付成功');
        return '支付成功';
      }
    } catch (e) {
      console.error(e);
      return '支付回调异常';
    }
  }

  async usernotify(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (user.role === 'VIP_USER') {
      return { responseCode: 200, message: '支付成功' };
    }
    return { responseCode: 500, message: '还未支付' };
  }
}
