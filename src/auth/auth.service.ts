import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { zip } from 'compressing';
import svgCaptcha from 'svg-captcha';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { PrismaService } from 'nestjs-prisma';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) return '用户已存在';
    const password = bcrypt.hashSync(createUserDto.password, 10);
    await this.prisma.user.create({
      data: { ...createUserDto, password },
    });
    return '注册成功';
  }

  async getCode(key: string) {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#fff',
    });
    await this.cacheManager.set(key, captcha.text, 5 * 60 * 1000);
    return captcha.data;
  }

  async login({ email, password, code, key }: UserLoginDto) {
    const cacheCode = await this.cacheManager.get<string>(key);
    if (!cacheCode) {
      return '验证码已过期';
    }
    if (cacheCode.toLowerCase() !== code.toLowerCase()) {
      return '验证码错误';
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return '用户不存在';
    if (bcrypt.compareSync(password, user.password)) {
      const token = await this.jwtService.signAsync(user, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      delete user.password;
      this.cacheManager.del(key);
      return { ...user, token };
    }
    return '密码错误';
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  downStream() {
    const url = 'src/img/R.jpeg';
    const tarStream = new zip.Stream();
    tarStream.addEntry(url);
    return tarStream;
  }
}
