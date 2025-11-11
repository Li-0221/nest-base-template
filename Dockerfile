# ---- 基础镜像 ----
# 使用一个包含 pnpm 的 Node.js 18 Alpine 镜像作为基础
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- 依赖阶段 ----
FROM base AS dependencies
WORKDIR /app
# 仅复制 pnpm 所需的清单文件
COPY package.json pnpm-lock.yaml ./
# 安装所有依赖（包括 devDependencies，因为构建和 prisma generate 需要它们）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ---- 构建阶段 ----
FROM base AS builder
WORKDIR /app
# 从依赖阶段复制 node_modules 和清单文件
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY prisma ./prisma
RUN pnpm exec prisma generate
COPY . .
RUN pnpm run build

# ---- 生产阶段 ----
FROM base AS production
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

CMD ["pm2-runtime", "./ecosystem.config.js"]