# ---- 基础构建环境 (Stage 1: builder) ----
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl

# 设置 PNPM 全局安装路径
RUN npm install -g pnpm 

WORKDIR /usr/src/app

# 先复制依赖配置文件，利用 Docker 缓存
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY prisma ./prisma/
COPY src ./src/
COPY public ./public/
COPY .env ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY ecosystem.config.js ./

# 生成 Prisma 客户端
RUN pnpm prisma:generate

# 构建应用
RUN pnpm run build

# 移除开发依赖
RUN pnpm prune --prod

# ---- 生产环境镜像 (Stage 2: production) ----
FROM node:22-alpine AS production

# 创建非 root 用户运行应用
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001 \
  && npm install -g pm2 \
  && apk add --no-cache openssl

WORKDIR /usr/src/app

# 复制构建产物
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/ecosystem.config.js ./

# 修改文件所有权
RUN chown -R nestjs:nodejs /usr/src/app

# 切换到非 root 用户
USER nestjs

EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]