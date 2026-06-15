# 服务器部署说明

## 1. 环境要求

| 组件 | 版本 |
|---|---|
| Node.js | 22+ |
| pnpm | 10+ |
| PostgreSQL | 16 |
| Meilisearch | 1.15+ |
| Nginx | 1.27+ |

---

## 2. 服务器环境安装

### Node.js + pnpm

```bash
# 安装 Node.js 22（以 Ubuntu 为例，或通过 nvm）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 启用 corepack（ pnpm 随 Node.js 22 内置）
corepack enable
```

### PostgreSQL 16

```bash
sudo apt-get install -y postgresql-16
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 创建数据库和用户
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE rainy_cole OWNER postgres;"
```

### Meilisearch

```bash
# 下载并安装
curl -L https://install.meilisearch.com | sh
sudo mv meilisearch /usr/local/bin/

# 创建 systemd 服务
sudo tee /etc/systemd/system/meilisearch.service << 'EOF'
[Unit]
Description=Meilisearch
After=network.target

[Service]
ExecStart=/usr/local/bin/meilisearch --master-key=your-master-key
Restart=always
User=meili
Environment=MEILI_HTTP_ADDR=127.0.0.1:7700

[Install]
WantedBy=multi-user.target
EOF

sudo useradd -r meili
sudo systemctl enable meilisearch
sudo systemctl start meilisearch
```

### Nginx

```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 3. 项目部署

```bash
# 拉取代码
cd /srv
git clone <your-repo-url> rainy-cole
cd /srv/rainy-cole

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库密码、JWT 密钥、Meilisearch 密钥等

# 安装依赖并构建
pnpm install
pnpm build
```

### 配置 Nginx

```bash
sudo cp infra/nginx/rainy-cole.conf /etc/nginx/sites-available/rainy-cole
sudo ln -s /etc/nginx/sites-available/rainy-cole /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 启动 API

```bash
# 直接启动（开发/调试用）
pnpm start:api

# 推荐使用 pm2 管理进程
npm install -g pm2
pm2 start apps/api/dist/src/main.js --name rainy-cole-api
pm2 save
pm2 startup
```

---

## 4. 数据库初始化

```bash
# 执行迁移
pnpm db:deploy

# 初始化种子数据（管理员账号、示例内容）
pnpm db:seed
```

默认管理员账号：`admin` / `123456`

---

## 5. 路由规则

- `/` → 博客前台静态资源
- `/admin/` → 管理后台静态资源
- `/api/` → 反向代理到 NestJS API（127.0.0.1:3000）
- `/uploads/` → 上传文件目录

---

## 6. 日常发布

```bash
cd /srv/rainy-cole
git pull
pnpm install
pnpm build
pm2 restart rainy-cole-api
```

如果 Prisma schema 有变更，额外执行：

```bash
pnpm db:deploy
```

---

## 7. 发布后验证

```bash
# 检查服务状态
pm2 status
sudo systemctl status nginx postgresql meilisearch

# 验证 API
curl -i http://127.0.0.1:3000/api/health

# 验证 Nginx 代理
curl -i http://127.0.0.1:80/api/health
curl -i http://127.0.0.1:80/
curl -i http://127.0.0.1:80/admin/
```

---

## 8. 常见问题

### 8.1 端口被占用

`POSTGRES_PORT`、`API_PORT`、`MEILI_PORT` 可在 `.env` 中修改。

### 8.2 API 报数据库表不存在

执行迁移：
```bash
pnpm db:deploy
```

### 8.3 /admin/ 刷新 404

检查 `/etc/nginx/sites-enabled/rainy-cole` 中 admin location 的 `try_files` 是否包含 `/admin/index.html` 回退。

### 8.4 /api/ 502

检查 API 进程是否存活：
```bash
pm2 status
```

检查 Nginx 错误日志：
```bash
sudo tail -f /var/log/nginx/error.log
```

重点检查 `.env` 中：
- `DATABASE_URL` 是否能连到 PostgreSQL
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` 是否已配置
- `MEILI_MASTER_KEY` 是否与 Meilisearch 一致

### 8.5 HTTPS 配置

获取 SSL 证书后，在 Nginx 配置中添加 SSL 相关指令，并将 HTTP 80 端口重定向到 HTTPS 443。
