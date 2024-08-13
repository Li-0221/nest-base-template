import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/common/decorator/auth.decorator';
import { UserDto } from '@/user/dto/user.dto';
import { UserResetDto } from './dto/user-reset.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('登陆模块')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin')
  @ApiOperation({ summary: '管理员登录' })
  adminLogin(@Body() adminLoginDto: LoginDto) {
    return this.authService.adminLogin(adminLoginDto);
  }

  @Post('registered')
  @ApiOperation({ summary: '用户注册' })
  registered(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiOkResponse({ type: UserDto })
  login(@Body() userLoginDto: LoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('resetPwd')
  @ApiOperation({ summary: '用户重置密码' })
  reset(@Body() userResetDto: UserResetDto) {
    return this.authService.resetPwd(userResetDto);
  }

  @Throttle({ default: { limit: 1, ttl: 59000 } }) //60s内只能请求一次
  @Post('sms')
  @ApiOperation({ summary: '短信验证码' })
  sms() {
    return this.authService.sms();
  }
}
