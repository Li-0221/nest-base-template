import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/common/decorator/user.decorator';
import { TagDto } from './dto/tag.dto';

@Controller('tag')
@ApiBearerAuth()
@ApiTags('标签模块')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '创建标签' })
  create(@User() user: User, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(user.id, createTagDto);
  }

  @Get()
  @ApiOperation({ summary: '获取标签列表' })
  @ApiOkResponse({ type: [TagDto] })
  findAll(@User() user: User) {
    return this.tagService.findAll(user.id);
  }

  @Patch()
  @ApiOperation({ summary: '编辑标签' })
  update(@Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除标签（标签下面的记账也会被清空）' })
  @ApiParam({ name: 'id', description: '标签id' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
