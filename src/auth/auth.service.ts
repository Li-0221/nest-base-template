import { Injectable, Inject } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@/auth/dto/login.dto';
import { UserResetDto } from './dto/user-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async adminLogin({ phone, password }: LoginDto) {
    const user = await this.prisma.admin.findUnique({ where: { phone } });
    if (!user) return { responseCode: 500, message: '用户不存在' };
    if (bcrypt.compareSync(password, user.password)) {
      const token = await this.jwtService.signAsync(user, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      delete user.password;
      return { ...user, token };
    }
    return { responseCode: 401, message: '密码错误' };
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: createUserDto.phone },
    });
    if (user) return { responseCode: 500, message: '用户已存在' };
    const password = bcrypt.hashSync(createUserDto.password, 10);
    await this.prisma.user.create({
      data: { ...createUserDto, password },
    });
    return '注册成功';
  }

  async resetPwd(userResetDto: UserResetDto) {
    const { phone, password } = userResetDto;
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: bcrypt.hashSync(password, 10) },
      });
      return '重置成功';
    } else {
      return { responseCode: 500, message: '没有查到该用户' };
    }
  }

  async login({ phone, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) return { responseCode: 500, message: '用户不存在' };
    if (user.status === 'Disabled')
      return { responseCode: 500, message: '您已被冻结，请联系管理员' };
    if (bcrypt.compareSync(password, user.password)) {
      delete user.token;
      delete user.password;
      const token = await this.jwtService.signAsync(user, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      await this.prisma.user.update({
        where: { id: user.id },
        data: { token, lastLoginAt: new Date() },
      });
      return { ...user, token };
    }
    return { responseCode: 401, message: '密码错误' };
  }

  async sms() {
    return '11';
  }
}
