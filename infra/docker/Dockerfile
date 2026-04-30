FROM node:22-alpine AS base

WORKDIR /workspace

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY . .

RUN pnpm --filter @rainy/shared build
RUN pnpm --filter @rainy/api prisma:generate
RUN pnpm --filter @rainy/api build
RUN pnpm --filter @rainy/web build
RUN pnpm --filter @rainy/admin build
RUN pnpm deploy --filter @rainy/api --prod --legacy /prod/api

FROM node:22-alpine AS api

WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=3000

COPY --from=build /prod/api ./
COPY --from=build /workspace/apps/api/dist ./dist
COPY --from=build /workspace/apps/api/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]

FROM nginx:1.27-alpine AS nginx

COPY infra/docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
COPY --from=build /workspace/apps/admin/dist /usr/share/nginx/html/admin
