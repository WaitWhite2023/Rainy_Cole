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

## 2. 本机或 CI 构建镜像

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml build
```

默认生成：

- `rainy-cole-api:latest`
- `rainy-cole-nginx:latest`

如果要推送到镜像仓库：

```bash
docker tag rainy-cole-api:latest your-registry/rainy-cole-api:latest
docker tag rainy-cole-nginx:latest your-registry/rainy-cole-nginx:latest

docker push your-registry/rainy-cole-api:latest
docker push your-registry/rainy-cole-nginx:latest
```

## 3. 服务器启动

如果服务器直接从当前代码构建：

```bash
pnpm docker:prod
```

如果服务器使用镜像仓库，在服务器 `.env` 中配置：

```bash
API_IMAGE=your-registry/rainy-cole-api:latest
NGINX_IMAGE=your-registry/rainy-cole-nginx:latest
```

然后启动：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml up -d
```

## 4. 数据库迁移

如果服务器保留源码和 pnpm 依赖，直接在项目根目录执行：

```bash
pnpm db:deploy
```

如需初始化种子数据：

```bash
pnpm db:seed
```

说明：这两个命令会读取项目根目录 `.env`。如果数据库跑在 compose 里的 `postgres` 容器，宿主机通过 `POSTGRES_PORT` 暴露的端口访问即可，默认是 `localhost:5432`。

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
