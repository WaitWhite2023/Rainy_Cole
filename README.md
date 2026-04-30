# Rainy Cole Blog Monorepo

个人博客 Monorepo 工程，包含前台、后台、API、共享包与 Docker 部署配置。

## 目录说明

- `apps/web`：博客前台，Vue 3 + Vite
- `apps/admin`：后台管理，Vue 3 + Vite
- `apps/api`：NestJS API
- `packages/shared`：共享 DTO、类型、常量
- `packages/config`：共享 TypeScript / Tailwind / ESLint 配置
- `infra/docker`：Docker Compose、Dockerfile、Nginx 配置
- `docs`：需求、方案、部署说明

## 环境配置

项目只保留一套配置模板：

```bash
cp .env.example .env
```

- `.env.example`：配置模板，提交到仓库
- `.env`：真实配置，本地和服务器运行时读取，不提交仓库

Docker Compose 也读取 `.env`。容器内部的数据库和搜索地址由 compose 自动改成 `postgres`、`meilisearch`，不需要单独维护 `.env.docker`。

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
```

说明：

- `pnpm dev`：先构建 `@rainy/shared`，再并行启动 web/admin/api
- `pnpm build`：按 workspace 依赖顺序构建 shared/api/web/admin

## Docker 开发环境

```bash
pnpm docker:dev
```

启动后访问：

- 前台：`http://localhost:5173`
- 后台：`http://localhost:5174/admin/`
- API：`http://localhost:3000/api/health`

开发环境使用源码挂载和热更新，适合日常开发联调。

## Docker 生产环境

```bash
pnpm docker:prod
```

启动后访问：

- 站点：`http://localhost:8080/`
- 后台：`http://localhost:8080/admin/`
- API：`http://localhost:8080/api/health`

生产环境会构建两个镜像：

- `rainy-cole-api:latest`
- `rainy-cole-nginx:latest`

Nginx 容器托管前台和后台静态资源，并将 `/api/` 反向代理到 API 容器。

停止生产环境：

```bash
pnpm docker:down
```

冒烟检查：

```bash
pnpm docker:verify
```

## 数据库

生成 Prisma Client：

```bash
pnpm db:generate
```

生产/容器环境执行迁移：

```bash
pnpm db:deploy
```

初始化种子数据：

```bash
pnpm db:seed
```

更多部署细节见：

- `docs/deployment.md`
- `docs/deploy-runbook.md`
