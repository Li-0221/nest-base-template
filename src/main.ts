import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Response from './common/response';
import HttpFilter from './common/http-filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { join } from 'path';
import express from 'express';
import chalk from 'chalk';
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './common/configs/config.interface';
// import helmet from 'helmet';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  //TODO 正式上线打开 helmet 通过适当设置 HTTP 标头来帮助保护应用免受一些众所周知的 Web 漏洞的影响
  // app.use(helmet());

  // 设置请求体大小限制为15MB
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));

  // compression 减小响应正文的大小，从而提高 Web 应用的速度
  app.use(compression());

  // prefix 所有路由增加统一前缀
  // app.setGlobalPrefix('v1');

  // 响应格式化
  app.useGlobalInterceptors(new Response());

  // http错误过滤
  app.useGlobalFilters(new HttpFilter());

  // Prisma Client 异常过了
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // 管道验证
  app.useGlobalPipes(new ValidationPipe());

  // 将静态资源托管到指定目录，前端打包出来的dist目录放到public下
  // 前端需设置路由为hash模式（history需要额外配置），前端接口的baseURl设置为 /
  // 部署时最好把整个nest项目放到服务器上，因为他会引用public下的静态资源
  // 如果设置了prefix 前端打包的base也要设置为'/app'
  app.useStaticAssets(join(__dirname, '..', 'public/dist'), {
    prefix: '/app',
  });

  // 文件存放地址，浏览器输入 http://localhost:5600/publicFile/img.jpg 能访问到图片
  // 如果同时存在前端和文件，那么都要添加prefix 不然就进前端的路由了
  // 访问的有问题就清浏览器缓存
  app.useStaticAssets(join(__dirname, '..', 'publicFile'), {
    prefix: '/publicFile',
  });

  // 启用应用程序的关闭钩子
  app.enableShutdownHooks();

  // cors
  if (corsConfig.enabled) app.enableCors();

  const port = nestConfig.port || process.env.PORT || 3000;

  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .setTitle(swaggerConfig.title)
      .setVersion(swaggerConfig.version)
      .setDescription(swaggerConfig.description)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  await app.listen(port);

  console.log(chalk.green(`当前环境：${process.env.NODE_ENV}`));

  if (swaggerConfig.enabled)
    console.log(
      chalk.green(`文档地址：http://localhost:${port}/${swaggerConfig.path}`),
    );

  console.log(process.env.NODE_ENV);
}

bootstrap();
