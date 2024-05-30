import { Injectable } from '@nestjs/common';
import { CreateSoftwareTypeDto } from './dto/create-software-type.dto';
import { PrismaService } from 'nestjs-prisma';
import { UpdateSoftwareTypeDto } from './dto/update-software-type.dto';

@Injectable()
export class SoftwareTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSoftwareTypeDto: CreateSoftwareTypeDto) {
    await this.prisma.softwareType.create({ data: createSoftwareTypeDto });
    return '新增类别成功';
  }

  async findAll() {
    const types: any = await this.prisma.softwareType.findMany({
      include: { SoftWare: true },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return types;
  }

  async update(updateSoftwareTypeDto: UpdateSoftwareTypeDto) {
    const { id, name } = updateSoftwareTypeDto;
    await this.prisma.softwareType.update({ where: { id }, data: { name } });
    return '更新成功';
  }

  async remove(id: string) {
    const count = await this.prisma.software.count({
      where: { softwareTypeId: id },
    });

    if (count) {
      return {
        responseCode: 500,
        message: `当前类别下有 ${count} 个软件，无法删除`,
      };
    }
    await this.prisma.softwareType.delete({ where: { id } });
    return '删除成功';
  }
}
