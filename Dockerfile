# 第一阶段：构建阶段
FROM node:20-alpine AS builder

# 安装系统依赖（Prisma需要的）
RUN apk add --no-cache openssl ca-certificates

WORKDIR /app

# 安装 PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# 先复制包管理文件
COPY package.json pnpm-lock.yaml* .npmrc* ./

# 安装所有依赖（包括devDependencies）
RUN pnpm install --frozen-lockfile

# 复制Prisma相关文件
COPY prisma ./prisma

# 生成Prisma客户端
RUN pnpm prisma generate

# 复制其他源代码
COPY . .

# 构建项目
RUN pnpm build

#==================================================

# 第二阶段：生产镜像
FROM node:20-alpine AS production

WORKDIR /app

# 安装系统依赖（Prisma需要的）
RUN apk add --no-cache openssl ca-certificates

# 安装 PM2
RUN npm install pm2 -g

# 复制必要的文件 
# 从builder阶段复制/app/node_modules到当前目录下的/node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/ecosystem.config.js ./

# 暴露端口（根据你的实际端口修改）
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:3000/health || exit 1

CMD ["pm2-runtime", "ecosystem.config.js"]