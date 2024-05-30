import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SoftwareTypeService } from './software-type.service';
import { CreateSoftwareTypeDto } from './dto/create-software-type.dto';
import { SoftWareTypeDto } from './dto/software-type.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateSoftwareTypeDto } from './dto/update-software-type.dto';
import { Public } from '@/common/decorator/auth.decorator';

@Controller('software-type')
@ApiBearerAuth()
@ApiTags('软件类别')
export class SoftwareTypeController {
  constructor(private readonly softwareTypeService: SoftwareTypeService) {}

  @Post('add')
  @ApiOperation({ summary: '新增类别' })
  create(@Body() createSoftwareTypeDto: CreateSoftwareTypeDto) {
    return this.softwareTypeService.create(createSoftwareTypeDto);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: '获取类别列表' })
  @ApiOkResponse({ type: [SoftWareTypeDto] })
  findAll() {
    return this.softwareTypeService.findAll();
  }

  @Post('edit')
  @ApiOperation({ summary: '编辑类别' })
  update(@Body() updateSoftwareTypeDto: UpdateSoftwareTypeDto) {
    return this.softwareTypeService.update(updateSoftwareTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除类别' })
  remove(@Param('id') id: string) {
    return this.softwareTypeService.remove(id);
  }
}
