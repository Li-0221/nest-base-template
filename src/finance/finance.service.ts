import { Injectable } from '@nestjs/common';
import { FinanceListDto } from './dto/finance-list.dto';
import { PrismaService } from 'nestjs-prisma';
import dayjs from 'dayjs';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async find(financeListDto: FinanceListDto) {
    const { pageNum, pageSize, createdAt, name, phone } = financeListDto;

    const where = {
      User: {
        // 查找资金表中用户名含有name的资金数据
        name: { contains: name },
        phone: { contains: phone },
      },
      createdAt:
        createdAt && createdAt.length === 2 && createdAt[1]
          ? {
              gte: dayjs(createdAt[0]).startOf('day').toDate(),
              lt: dayjs(createdAt[1]).endOf('day').toDate(),
            }
          : undefined,
    };

    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const finances = await this.prisma.finance.findMany({
      where,
      skip,
      take,
      // 查出来的结果要包含用户信息
      include: { User: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.finance.count({ where });
    return { total, finances };
  }

  async getCount() {
    const finances = await this.prisma.finance.findMany();
    let today = 0;
    let history = 0;

    finances.forEach(({ amount, createdAt }) => {
      history += amount;
      if (
        dayjs(createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
      ) {
        today += amount;
      }
    });

    return { today, history };
  }

  async stats(type: 'day' | 'month') {
    const list = [];
    if (type === 'day') {
      const startOfWeek = dayjs().subtract(6, 'day');

      for (let i = 0; i < 7; i++) {
        let amount = 0;
        const date = startOfWeek.add(i, 'day');

        const finances = await this.prisma.finance.findMany({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: date.endOf('day').toDate(),
            },
          },
        });
        finances.forEach((item) => (amount += item.amount));

        list.push({ date: date.format('YYYY-MM-DD'), amount });
      }
    } else if (type === 'month') {
      const startOfYear = dayjs().subtract(11, 'month').startOf('month');

      for (let i = 0; i < 12; i++) {
        let amount = 0;
        const date = startOfYear.add(i, 'month');
        const nextDate = date.add(1, 'month');

        const finances = await this.prisma.finance.findMany({
          where: {
            createdAt: {
              gte: date.startOf('day').toDate(),
              lt: nextDate.endOf('day').toDate(),
            },
          },
        });
        finances.forEach((item) => (amount += item.amount));
        list.push({ month: date.format('YYYY-MM'), amount });
      }
    }
    console.log(list);

    return list;
  }
}
