module.exports = {
  apps: [
    {
      name: 'nestjs-prisma-app',
      script: 'dist/main.js',
      instances: 'max',
      autorestart: true, // 自动重启
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      // 输出日志的配置
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
