# Docker 与 Nginx 部署说明

## 1. 部署目标

将前台、后台、API、PostgreSQL、Meilisearch、Nginx 统一部署到阿里云 Linux 服务器。

## 2. 服务清单

- `web`：博客前台
- `admin`：后台管理
- `api`：NestJS 服务
- `postgres`：文章与后台数据
- `meilisearch`：全文搜索
- `nginx`：统一入口与静态资源代理

其中 `web`、`admin`、`api` 通过以下 Dockerfile 构建：

- `infra/docker/Dockerfile.web`
- `infra/docker/Dockerfile.admin`
- `infra/docker/Dockerfile.api`

## 3. 路由规则

- `/` -> `web`
- `/admin/` -> `admin`
- `/api/` -> `api`
- `/uploads/` -> 本地上传目录

## 4. 部署步骤

1. 安装 Docker 与 Docker Compose
2. 本机直跑时复制 `.env.example` 为 `.env`
3. Docker Compose 方式联调时复制 `.env.docker.example` 为 `.env.docker`
4. 按服务器实际情况修改数据库密码、JWT 密钥、域名与端口
5. 新版 Docker 使用 `docker compose --env-file .env.docker -f infra/docker/docker-compose.yml up -d --build`
6. 若本机只有旧版 Compose，可改用 `docker-compose --env-file .env.docker -f infra/docker/docker-compose.yml up -d --build`
7. 检查容器状态与 Nginx 代理结果
8. 若需要从宿主机执行 Prisma 初始化，但数据库跑在 Docker 容器中，请使用 `pnpm db:setup:docker`

若宿主机 `3000` 端口被占用，可临时改宿主映射端口启动（容器内端口仍是 `3000`）：

```bash
API_PORT=3001 docker compose --env-file .env.docker -f infra/docker/docker-compose.yml up -d --build
```

## 4.1 本地联调与验收演练（Day 6 / Day 7）

1. 启动或更新容器

```bash
pnpm docker:up
```

2. 执行冒烟检查

```bash
pnpm docker:verify
```

3. 预期结果

- `docker compose ps` 中 `web/admin/api/postgres/meilisearch/nginx` 均为 `Up`
- `GET /api/health` 返回 `200` 且含 `"status":"ok"`
- `HEAD /admin` 返回 `301`（重定向到 `/admin/`）
- `HEAD /api` 返回 `301`（重定向到 `/api/`）

4. 若出现 `502 Bad Gateway`

- 先看 `api` 容器是否正常：`docker compose --env-file .env.docker -f infra/docker/docker-compose.yml logs --tail 50 api`
- 若 `api` 刚被重建，重启一次 `nginx` 刷新上游：`docker compose --env-file .env.docker -f infra/docker/docker-compose.yml restart nginx`

## 5. 建议目录与挂载

- 代码目录：`/srv/rainy-cole`
- 上传目录：`/srv/rainy-cole/uploads`
- 数据目录：`/srv/rainy-cole/data`

## 6. 生产建议

- 使用 HTTPS
- 将上传目录与数据库目录挂载到宿主机
- 给 PostgreSQL 和 Meilisearch 配置持久化卷
- 通过 Nginx 限制上传大小并开启 gzip
- Docker Compose 场景下，`DATABASE_URL` 中的数据库主机必须写成 `postgres`，因为容器之间通过服务名通信
- 不要把本机直跑用的 `.env` 直接复用给 Compose；两者的数据库主机不同
- `pnpm db:setup` 默认读取 `.env`
- `pnpm db:setup:docker` 默认读取 `.env.docker`
