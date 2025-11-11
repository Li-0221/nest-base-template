# ---- 基础构建环境 (Stage 1: builder) ----
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
COPY src ./src/
COPY public ./public/
COPY publicFile ./publicFile/
COPY .env ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY ecosystem.config.js ./

RUN pnpm exec prisma generate

RUN pnpm run build

RUN pnpm prune --prod

# ---- 生产环境镜像 (Stage 2: production) ----
FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/ecosystem.config.js ./

EXPOSE 3000

CMD ["pnpm", "exec", "pm2-runtime", "ecosystem.config.js"]