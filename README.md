# Rainy Cole Blog Monorepo

个人博客 Monorepo 工程，包含：

- `apps/web`：博客前台
- `apps/admin`：后台管理
- `apps/api`：NestJS API
- `packages/shared`：共享类型与常量
- `packages/config`：共享配置
- `content/posts`：Markdown 文章
- `infra/docker`：Docker 与 Nginx 配置

文档优先，请先阅读 `docs/` 目录中的需求、方案与部署说明。

## 本地开发（推荐）

统一使用“本地跑应用 + Docker 跑依赖”：

1. 启动基础依赖（默认只起 PostgreSQL）

```bash
pnpm docker:deps:up
```

如果需要验证 Meilisearch，再执行：

```bash
pnpm docker:deps:up:search
```

2. 初始化数据库（首次或迁移后）

```bash
pnpm db:setup
```

3. 启动应用

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:admin
```

- 前台：`http://localhost:5173`
- 后台：`http://localhost:5174/admin/login`
- API：`http://localhost:3000/api/health`

停止依赖服务：

```bash
pnpm docker:deps:down
```
