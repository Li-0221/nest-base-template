import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { SoftwareListDto } from './dto/software-list';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { CreateSoftwareDto } from './dto/create-software.dto';
import dayjs from 'dayjs';

@Injectable()
export class SoftwareService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSoftwareDto: CreateSoftwareDto) {
    await this.prisma.software.create({
      data: createSoftwareDto,
    });
    return '创建成功';
  }

  async findOne(id: string) {
    const software = await this.prisma.software.findUnique({ where: { id } });
    return software;
  }

  async find(softwareListDto: SoftwareListDto) {
    const { pageNum, pageSize, updatedAt, createdAt, title, softwareTypeId } =
      softwareListDto;

    const where = {
      title: { contains: title },
      softwareTypeId: softwareTypeId ? softwareTypeId : undefined,
      createdAt:
        createdAt && createdAt.length === 2 && createdAt[1]
          ? {
              gte: dayjs(createdAt[0]).startOf('day').toDate(),
              lt: dayjs(createdAt[1]).endOf('day').toDate(),
            }
          : undefined,
      updatedAt:
        createdAt && updatedAt.length === 2 && updatedAt[1]
          ? {
              gte: dayjs(updatedAt[0]).startOf('day').toDate(),
              lt: dayjs(updatedAt[1]).endOf('day').toDate(),
            }
          : undefined,
    };
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const softwares = await this.prisma.software.findMany({
      where,
      skip,
      take,
      orderBy: { updatedAt: 'desc' },
    });
    const total = await this.prisma.software.count({ where });
    return { softwares, total };
  }

  async update(updateSoftwareDto: UpdateSoftwareDto) {
    const { id } = updateSoftwareDto;
    await this.prisma.software.update({
      where: { id },
      data: updateSoftwareDto,
    });
    return '操作成功';
  }

  async remove(id: string) {
    await this.prisma.software.delete({
      where: { id },
    });
    return '操作成功';
  }

  async websiteSoftware() {
    // 获取最新的4个software
    const latestSoftware = await this.prisma.software.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 获取所有的softwareType的前10个software
    const softwareTypes = await this.prisma.softwareType.findMany();
    const softwareWithTypes = [];

    for (const type of softwareTypes) {
      const software = await this.prisma.software.findMany({
        where: {
          softwareTypeId: type.id,
        },
        take: 10,
      });

      softwareWithTypes.push({
        type: type,
        software: software,
      });
    }

    return { latestSoftware, softwareWithTypes };
  }
}
