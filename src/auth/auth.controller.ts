import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Header,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '@/common/decorator/auth.decorator';
import { UserDto } from '@/auth/dto/user.dto';

@ApiTags('用户模块')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registered')
  @ApiOperation({ summary: '用户注册' })
  registered(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('code')
  @Header('Content-Type', 'image/svg+xml')
  @ApiOperation({ summary: '获取验证码' })
  @ApiQuery({ name: 'key', description: '验证码key，随机生成即可' })
  async getCode(@Res() res: Response, @Query('key') key: string) {
    const svg = await this.authService.getCode(key);
    res.send(svg);
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ type: UserDto })
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }
}
