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

## 3. 路由规则

- `/` -> `web`
- `/admin/` -> `admin`
- `/api/` -> `api`
- `/uploads/` -> 本地上传目录

## 4. 部署步骤

1. 安装 Docker 与 Docker Compose
2. 复制 `.env.example` 为 `.env.production`
3. 按服务器实际情况修改数据库密码、JWT 密钥、域名与端口
4. 执行 `docker compose -f infra/docker/docker-compose.yml up -d --build`
5. 检查容器状态与 Nginx 代理结果

## 5. 建议目录与挂载

- 代码目录：`/srv/rainy-cole`
- 上传目录：`/srv/rainy-cole/uploads`
- 数据目录：`/srv/rainy-cole/data`

## 6. 生产建议

- 使用 HTTPS
- 将上传目录与数据库目录挂载到宿主机
- 给 PostgreSQL 和 Meilisearch 配置持久化卷
- 通过 Nginx 限制上传大小并开启 gzip
