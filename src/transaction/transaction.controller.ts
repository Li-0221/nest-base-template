import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionDto } from './dto/list-transaction.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/common/decorator/user.decorator';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transaction')
@ApiBearerAuth()
@ApiTags('记账模块')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: '新增记账' })
  create(
    @User() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create(user.id, createTransactionDto);
  }

  @Post('list')
  @ApiOperation({ summary: '记账列表（标签查询、分页查询、时间查询）' })
  @ApiOkResponse({ type: [TransactionDto] })
  findAll(@User() user: User, @Body() listTransactionDto: ListTransactionDto) {
    return this.transactionService.findList(user.id, listTransactionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '记账详情' })
  @ApiParam({ name: 'id', description: '记账id' })
  @ApiOkResponse({ type: TransactionDto })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch()
  @ApiOperation({ summary: '编辑记账' })
  update(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除记账' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
