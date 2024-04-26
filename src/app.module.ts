import { MiddlewareConsumer, Module, Logger } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { TransactionModule } from './transaction/transaction.module';
import LoggerMiddleware from './common/middleware/logger.middleware';
import { AuthGuard } from './common/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { ThrottlerBehindProxyGuard } from '@/common/guard/throttler-behind-proxy.guard';

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
      signOptions: { expiresIn: '2days' },
    }),
    // @SkipThrottle() 取消对某个路由的节流限制
    // @Throttle() 覆盖默认配置
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // 如需使用redis https://docs.nestjs.com/techniques/caching#different-stores
    CacheModule.register({ max: 100, isGlobal: true }),

    AuthModule,
    TagModule,
    TransactionModule,
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
