import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceListDto } from './dto/finance-list.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { StatsDto } from './dto/stats.dto';
import { FinanceDto } from './dto/finance.dto';

@ApiBearerAuth()
@Controller('finance')
@ApiTags('财务模块')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('list')
  @ApiOperation({ summary: '获取财务列表' })
  @ApiOkResponse({ type: [FinanceDto] })
  find(@Body() financeListDto: FinanceListDto) {
    return this.financeService.find(financeListDto);
  }

  @Get('count')
  @ApiOperation({ summary: '获取统计数据' })
  @ApiOkResponse({ type: [StatsDto] })
  count() {
    return this.financeService.getCount();
  }

  @Get('stats')
  @ApiOperation({ summary: '获取统计数据(月 日)' })
  stats(@Query('type') type: 'day' | 'month') {
    return this.financeService.stats(type);
  }
}
