# 生产部署操作手册

> 目标：用最少命令完成构建、发布、验证和排障。

## 1. 前置条件

- 服务器已安装 Docker 和 Docker Compose
- 服务器安全组已放行站点端口，默认 `8080`
- 项目根目录已有 `.env`
- `.env` 已配置数据库密码、JWT 密钥、Meilisearch 密钥

首次创建 `.env`：

```bash
cp .env.example .env
```

## 2. 日常发布

当前服务器部署方式：服务器拉取代码，然后在服务器上构建镜像并启动。

```bash
cd /srv/rainy-cole
git pull
pnpm install
pnpm docker:prod
```

`pnpm docker:prod` 会执行：

- 构建 `rainy-cole-api:latest`
- 构建 `rainy-cole-nginx:latest`
- 启动 `api`、`nginx`、`postgres`、`meilisearch`

## 3. 首次部署

首次部署比日常发布多一步 `.env` 初始化：

```bash
cd /srv
git clone <your-repo-url> rainy-cole
cd /srv/rainy-cole
cp .env.example .env
pnpm install
pnpm docker:prod
pnpm db:deploy
```

如果需要初始化默认账号和基础数据：

```bash
pnpm db:seed
```

## 4. 数据库迁移

每次涉及 Prisma schema 或数据库迁移后，执行：

```bash
pnpm db:deploy
```

如需初始化种子数据：

```bash
pnpm db:seed
```

说明：这两个命令会读取项目根目录 `.env`。如果数据库跑在 compose 里的 `postgres` 容器，宿主机通过 `POSTGRES_PORT` 暴露的端口访问即可，默认是 `localhost:5432`。

## 4.1 可选：镜像仓库发布

当前不使用这套方式。后续如果改成 CI 构建镜像、服务器只拉镜像，可以在服务器 `.env` 中配置：

```bash
API_IMAGE=your-registry/rainy-cole-api:latest
NGINX_IMAGE=your-registry/rainy-cole-nginx:latest
```

然后执行：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml up -d
```

## 5. 发布后验证

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml ps
curl -i http://127.0.0.1:8080/api/health
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/admin/
```

也可以执行：

```bash
pnpm docker:verify
```

## 6. 常见操作

查看日志：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml logs --tail 120 nginx api postgres meilisearch
```

重启 API 和 Nginx：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml restart api nginx
```

停止服务：

```bash
pnpm docker:down
```

## 7. 常见问题

### 7.1 端口被占用

如果宿主机 `8080` 被占用，修改 `.env`：

```bash
NGINX_PORT=8081
```

如果宿主机 `5432` 被占用，修改 `.env`：

```bash
POSTGRES_PORT=55432
```

### 7.2 API 报数据库表不存在

执行迁移：

```bash
pnpm db:deploy
```

### 7.3 `/admin/` 刷新 404

检查 `infra/docker/nginx/default.conf` 中是否存在：

```nginx
location /admin/ {
  try_files $uri $uri/ /admin/index.html;
}
```

### 7.4 `/api/` 502

先看 API 日志：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml logs --tail 120 api
```

重点检查：

- `DATABASE_URL` 是否能连到 `postgres`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` 是否已配置
- `MEILI_MASTER_KEY` 是否与 Meilisearch 一致

## 8. 慎用操作

一般不要执行：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml down -v
```

`-v` 会删除数据库、搜索索引、上传文件等 volume 数据。
