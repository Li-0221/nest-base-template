import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { RecordListDto } from './dto/record-list.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateRecordDto } from './dto/create-log.dto';
import dayjs from 'dayjs';

@Injectable()
export class RecordService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRecordDto: CreateRecordDto) {
    await this.prisma.record.create({ data: createRecordDto });
    return '创建成功';
  }

  async find(recordListDto: RecordListDto) {
    const { pageNum, pageSize, createdAt, updatedAt, time } = recordListDto;

    const where = {
      time:
        time && time.length === 2 && time[1]
          ? {
              gte: dayjs(time[0]).startOf('day').toDate(),
              lt: dayjs(time[1]).endOf('day').toDate(),
            }
          : undefined,
      createdAt:
        createdAt && createdAt.length === 2 && createdAt[1]
          ? {
              gte: dayjs(createdAt[0]).startOf('day').toDate(),
              lt: dayjs(createdAt[1]).endOf('day').toDate(),
            }
          : undefined,
      updatedAt:
        updatedAt && updatedAt.length === 2 && updatedAt[1]
          ? {
              gte: dayjs(updatedAt[0]).startOf('day').toDate(),
              lt: dayjs(updatedAt[1]).endOf('day').toDate(),
            }
          : undefined,
    };
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;
    const logs = await this.prisma.record.findMany({
      where,
      skip,
      take,
      orderBy: { time: 'desc' },
    });
    const total = await this.prisma.record.count({ where });
    return { total, logs };
  }

  async update(updateRecordDto: UpdateRecordDto) {
    const { id, ...params } = updateRecordDto;
    await this.prisma.record.update({
      where: { id },
      data: params,
    });
    return '操作成功';
  }

  async remove(id: string) {
    await this.prisma.record.delete({
      where: { id },
    });
    return '操作成功';
  }
}
