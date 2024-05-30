import {
  Controller,
  Body,
  Post,
  Delete,
  Query,
  Param,
  Get,
} from '@nestjs/common';
import { SoftwareService } from './software.service';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SoftwareListDto } from './dto/software-list';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { Public } from '@/common/decorator/auth.decorator';
import { SoftwareDto } from './dto/software.dto';

@Controller('software')
@ApiBearerAuth()
@ApiTags('软件模块')
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Post('create')
  @ApiOperation({ summary: '新增软件' })
  create(@Body() createSoftwareDto: CreateSoftwareDto) {
    return this.softwareService.create(createSoftwareDto);
  }

  @Public()
  @Post('list')
  @ApiOperation({ summary: '软件列表' })
  @ApiOkResponse({ type: [SoftwareDto] })
  findAll(@Body() softwareListDto: SoftwareListDto) {
    return this.softwareService.find(softwareListDto);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取某个软件详情' })
  @ApiOkResponse({ type: SoftwareDto })
  findOne(@Param('id') id: string) {
    return this.softwareService.findOne(id);
  }

  @Post('edit')
  @ApiOperation({ summary: '编辑' })
  update(@Body() updateSoftwareDto: UpdateSoftwareDto) {
    return this.softwareService.update(updateSoftwareDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return this.softwareService.remove(id);
  }

  @Public()
  @Post('website-software')
  @ApiOperation({ summary: '官网首页的软件' })
  websiteSoftware() {
    return this.softwareService.websiteSoftware();
  }
}
