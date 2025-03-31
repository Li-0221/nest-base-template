import type { Config } from './config.interface';

// 结构化应用参数 应用名称、版本号、端口、文件上传大小限制、全局功能开关
const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nestjs Swagger',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
};

export default (): Config => config;
