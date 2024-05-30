import {
  Controller,
  Body,
  Post,
  Delete,
  Param,
  Get,
  Headers,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserListDto } from './dto/user-list.dto';
import { User } from '@/common/decorator/user.decorator';

@Controller('user')
@ApiBearerAuth()
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('list')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiOkResponse({ type: [UserDto] })
  findAll(@Body() userListDto: UserListDto) {
    return this.userService.find(userListDto);
  }

  @Post('edit')
  @ApiOperation({ summary: '编辑用户状态' })
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('login-count')
  @ApiOperation({ summary: '在软件上登一次调用一次' })
  count(@User() user: UserDto, @Headers('authorization') token: string) {
    return this.userService.count(user, token);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取统计数据' })
  stats(@Query('type') type: 'day' | 'month') {
    return this.userService.stats(type);
  }
}
