module.exports = {
  apps: [
    {
      name: 'server-name',
      script: 'dist/main.js',
      // 把 instances 设置为 max，PM2 会依据服务器的 CPU 核心数量来创建多个应用实例，每个实例可以在不同的 CPU 核心上运行，从而充分利用服务器的多核处理能力，提升应用的整体性能和吞吐量。
      // 所以会运行多次main.js
      instances: 'max',
      autorestart: true, // 自动重启
      exec_mode: 'cluster',
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
