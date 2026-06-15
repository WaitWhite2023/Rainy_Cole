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

以下提供 Ubuntu/Debian（apt）和 Alibaba Cloud Linux / CentOS（dnf）两种安装方式。

### 2.1 Node.js + pnpm

**Ubuntu/Debian：**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
corepack enable
```

**Alibaba Cloud Linux / CentOS：**
```bash
# 默认 dnf 源的 Node.js 版本偏旧，使用 NodeSource 官方 rpm 源
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf remove -y nodejs
sudo dnf install -y nodejs
node -v   # 确认 22.x

# pnpm — 如果 corepack 不可用则直接用 npm 装
npm install -g pnpm
```

### 2.2 PostgreSQL

**Ubuntu/Debian：**
```bash
sudo apt-get install -y postgresql-16
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

**Alibaba Cloud Linux / CentOS（默认源只有 PG 13，需用官方仓库装 PG 16）：**
```bash
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -y remove postgresql-server
sudo dnf install -y postgresql16-server
sudo /usr/pgsql-16/bin/postgresql-16-setup initdb
sudo systemctl enable postgresql-16
sudo systemctl start postgresql-16
```

**创建数据库和用户（通用）：**
```bash
# Alibaba Cloud Linux 需先加 PATH
export PATH="/usr/pgsql-16/bin:$PATH"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE rainy_cole OWNER postgres;"
```

### 2.3 Meilisearch（通用）

```bash
curl -L https://install.meilisearch.com | sh
sudo mv meilisearch /usr/local/bin/

# 创建 systemd 服务
sudo useradd -r meili
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

sudo systemctl enable meilisearch
sudo systemctl start meilisearch
```

### 2.4 Nginx

**Ubuntu/Debian：**
```bash
sudo apt-get install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Alibaba Cloud Linux / CentOS（默认 dnf 源不含 nginx，需先启用 EPEL）：**
```bash
sudo dnf install -y epel-release
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 3. 项目部署

```bash
cd /srv
git clone <your-repo-url> rainy-cole
cd /srv/rainy-cole

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入数据库密码、JWT 密钥、Meilisearch master key 等

# 安装依赖并构建
pnpm install
pnpm build
```

### 配置 Nginx

**Ubuntu/Debian：**
```bash
sudo cp infra/nginx/rainy-cole.conf /etc/nginx/sites-available/rainy-cole
sudo ln -sf /etc/nginx/sites-available/rainy-cole /etc/nginx/sites-enabled/
# 如果存在默认站点，可移除
sudo rm -f /etc/nginx/sites-enabled/default
```

**Alibaba Cloud Linux / CentOS：**
```bash
sudo cp infra/nginx/rainy-cole.conf /etc/nginx/conf.d/rainy-cole.conf
# 如果存在默认 server 配置，可移除
sudo rm -f /etc/nginx/conf.d/default.conf
```

**通用：**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 启动 API

```bash
# 推荐使用 pm2 管理进程
npm install -g pm2
pm2 start apps/api/dist/src/main.js --name rainy-cole-api
pm2 save
pm2 startup
```

---

## 4. 数据库初始化

```bash
pnpm db:deploy
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

```bash
pnpm db:deploy
```

### 8.3 /admin/ 刷新 404

检查 Nginx 配置中 admin location 的 `try_files` 是否包含 `/admin/index.html` 回退。

### 8.4 /api/ 502

检查 API 进程：
```bash
pm2 status
```

查看 Nginx 日志：
```bash
sudo tail -f /var/log/nginx/error.log
```

检查 `.env` 中 `DATABASE_URL`、`JWT_ACCESS_SECRET`、`MEILI_MASTER_KEY` 是否正确。

### 8.5 阿里云安全组

在阿里云控制台安全组中放行端口：
- `80`（Nginx HTTP）
- `443`（如需 HTTPS）

数据库端口（5432）和 Meilisearch 端口（7700）仅监听 `127.0.0.1`，无需对公网开放。

### 8.6 HTTPS 配置

获取 SSL 证书后，在 Nginx 配置中添加 SSL 相关指令，并将 HTTP 80 重定向到 HTTPS 443。
