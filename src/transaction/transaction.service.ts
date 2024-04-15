import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionDto } from './dto/list-transaction.dto';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    await this.prisma.transaction.create({
      data: { ...createTransactionDto, userId },
    });
    return '新增记账成功';
  }

  async findList(userId: string, listTransactionDto: ListTransactionDto) {
    const { pageNum, pageSize, tagId, beginTime, endTime } = listTransactionDto;

    const where: Prisma.TransactionWhereInput = {
      userId,
    };

    if (tagId) where.tagId = tagId;
    if (beginTime && endTime) {
      where.createdAt = {
        gte: new Date(beginTime),
        lte: new Date(endTime),
      };
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return transactions;
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        tagId: true,
        tag: true,
      },
      where: { id },
    });
    return transaction;
  }

  async update(updateTransactionDto: UpdateTransactionDto) {
    await this.prisma.transaction.update({
      where: { id: updateTransactionDto.id },
      data: updateTransactionDto,
    });
    return '记账更新成功';
  }

  async remove(id: string) {
    await this.prisma.transaction.delete({ where: { id } });
    return '记账删除成功';
  }
}
