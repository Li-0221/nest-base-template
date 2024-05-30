import { Controller, Body, Post, Delete, Param } from '@nestjs/common';
import { RecordService } from './record.service';
import { UpdateRecordDto } from './dto/update-record.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecordDto } from './dto/record.dto';
import { RecordListDto } from './dto/record-list.dto';
import { CreateRecordDto } from './dto/create-log.dto';
import { Public } from '@/common/decorator/auth.decorator';

@Controller('log')
@ApiBearerAuth()
@ApiTags('日志')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post('create')
  @ApiOperation({ summary: '新增日志' })
  create(@Body() createLogDto: CreateRecordDto) {
    return this.recordService.create(createLogDto);
  }

  @Public()
  @Post('list')
  @ApiOperation({ summary: '日志列表' })
  @ApiOkResponse({ type: [RecordDto] })
  findAll(@Body() recordListDto: RecordListDto) {
    return this.recordService.find(recordListDto);
  }

  @Post('edit')
  @ApiOperation({ summary: '编辑日志' })
  update(@Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.update(updateRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return this.recordService.remove(id);
  }
}
