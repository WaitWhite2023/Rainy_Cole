# Docker 与 Nginx 部署说明

## 1. 环境文件

项目只保留一套模板：

- `.env.example`：配置模板，可以提交到仓库，不放真实密钥
- `.env`：本地/服务器真实配置，不提交仓库

初始化配置：

```bash
cp .env.example .env
```

Docker Compose 也读取 `.env`。容器内的 `DATABASE_URL` 和 `MEILI_HOST` 由 compose 自动改成 `postgres`、`meilisearch`，所以不需要再维护 `.env.docker`。

## 2. 服务清单

- `web`：博客前台，生产环境构建为静态资源
- `admin`：后台管理，生产环境构建为静态资源
- `api`：NestJS 服务
- `postgres`：数据库
- `meilisearch`：全文搜索
- `nginx`：统一入口，托管静态资源并反向代理 API

## 3. 开发环境

开发环境使用源码挂载和热更新：

```bash
pnpm docker:dev
```

入口：

- 前台：`http://localhost:5173`
- 后台：`http://localhost:5174/admin/`
- API：`http://localhost:3000/api/`

对应文件：

- `infra/docker/docker-compose.dev.yml`
- `infra/docker/Dockerfile`

## 4. 生产环境

生产环境构建两个镜像：

- `rainy-cole-api:latest`
- `rainy-cole-nginx:latest`

启动：

```bash
pnpm docker:prod
```

停止：

```bash
pnpm docker:down
```

冒烟检查：

```bash
pnpm docker:verify
```

对应文件：

- `infra/docker/docker-compose.prod.yml`
- `infra/docker/Dockerfile`
- `infra/docker/nginx/default.conf`

## 5. 路由规则

- `/` -> web 静态资源
- `/admin/` -> admin 静态资源
- `/api/` -> api 容器
- `/uploads/` -> 上传文件 volume

## 6. 云服务器部署

当前推荐方式：云服务器拉取代码，在服务器上构建生产镜像并启动。

```bash
cd /srv/rainy-cole
git pull
pnpm install
pnpm docker:prod
pnpm db:deploy
pnpm docker:verify
```

`pnpm docker:prod` 会在服务器上构建：

- `rainy-cole-api:latest`
- `rainy-cole-nginx:latest`

然后启动生产 compose。

服务器安全组至少放行：

- `8080`：当前 Nginx 对外端口
- `80` / `443`：后续绑定域名和 HTTPS 时使用

## 7. 可选：镜像仓库部署

如果后续改成 CI 构建镜像、服务器只拉镜像，可以使用以下流程。

构建并推送：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml build
docker tag rainy-cole-api:latest your-registry/rainy-cole-api:latest
docker tag rainy-cole-nginx:latest your-registry/rainy-cole-nginx:latest
docker push your-registry/rainy-cole-api:latest
docker push your-registry/rainy-cole-nginx:latest
```

服务器 `.env` 中覆盖镜像地址：

```bash
API_IMAGE=your-registry/rainy-cole-api:latest
NGINX_IMAGE=your-registry/rainy-cole-nginx:latest
```

服务器启动：

```bash
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml up -d
```
