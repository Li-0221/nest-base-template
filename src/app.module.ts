import { MiddlewareConsumer, Module, Logger } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import LoggerMiddleware from './common/middleware/logger.middleware';
import { AuthGuard } from './common/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ThrottlerBehindProxyGuard } from '@/common/guard/throttler-behind-proxy.guard';
import { UserModule } from './user/user.module';
import { FinanceModule } from './finance/finance.module';
import { SoftwareTypeModule } from './software-type/software-type.module';
import { SoftwareModule } from './software/software.module';
import { FileModule } from './file/file.module';
import { RecordModule } from './record/record.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '7days' },
    }),
    // @SkipThrottle() 取消对某个路由的节流限制
    // @Throttle() 覆盖默认配置
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000, //60s 内一个接口允许请求 600次
        limit: 600,
      },
    ]),
    // 如需使用redis https://docs.nestjs.com/techniques/caching#different-stores
    CacheModule.register({ max: 100, isGlobal: true }),

    AuthModule,
    UserModule,
    FinanceModule,
    SoftwareTypeModule,
    SoftwareModule,
    RecordModule,
    FileModule,
    PayModule,
  ],
  controllers: [AppController],
  providers: [
    // token守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // 请求守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },

    // BUG https://juejin.cn/post/7290795913136799800
    // BUG 他会缓存get请求 如果短时间对一个get请求多次 他会读缓存
    // 我调了删除接口 然后调列表接口 ，然后再删一个 再调列表。界面没有刷新
    // 缓存拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
