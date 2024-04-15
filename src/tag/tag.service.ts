import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, createTagDto: CreateTagDto) {
    const { name } = createTagDto;
    const tag = await this.prisma.tag.findFirst({
      where: { userId, name },
    });
    if (tag) return `您当前已经有一个名为${name}的标签`;
    await this.prisma.tag.create({ data: { userId, ...createTagDto } });
    return '标签新增成功';
  }

  async findAll(userId: string) {
    const tags = await this.prisma.tag.findMany({
      where: {
        userId,
      },
    });
    return tags;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async update(updateTagDto: UpdateTagDto) {
    await this.prisma.tag.update({
      where: { id: updateTagDto.id },
      data: updateTagDto,
    });
    return '标签更新成功';
  }

  async remove(id: string) {
    await this.prisma.tag.delete({ where: { id } });
    // TODO 删除标签下面的记账
    return '标签删除成功';
  }
}
