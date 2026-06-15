# 服务器部署说明

## 1. 环境要求

| 组件 | 版本 | 说明 |
|---|---|---|
| Node.js | 22+ | NodeSource 源安装 |
| pnpm | 10+ | `npm install -g pnpm` |
| PostgreSQL | 13+ | 阿里云自带 13 可直接用 |
| Meilisearch | 1.15+ | 二进制文件启动 |
| Nginx | 1.x | 统一入口 |

---

## 2. 服务器环境安装

### 2.1 Ubuntu/Debian

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx postgresql
npm install -g pnpm

# PostgreSQL
sudo systemctl enable postgresql && sudo systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE rainy_cole OWNER postgres;"

# Meilisearch（本地下载后 scp 到 /usr/local/bin/meilisearch）
sudo chmod +x /usr/local/bin/meilisearch
nohup /usr/local/bin/meilisearch --master-key=your-master-key --http-addr 127.0.0.1:7700 > /dev/null 2>&1 &

# Nginx
sudo systemctl enable nginx && sudo systemctl start nginx
```

### 2.2 Alibaba Cloud Linux / CentOS

```bash
# Node.js 22（卸载旧版，装新版）
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf remove -y nodejs && sudo dnf install -y nodejs
npm install -g pnpm

# PostgreSQL（阿里云自带 13 已够用，直接启动）
sudo systemctl enable postgresql && sudo systemctl start postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your-password';"
sudo -u postgres psql -c "CREATE DATABASE rainy_cole OWNER postgres;"

# 如果 pg_hba.conf 导致连接拒绝，改为 trust：
sudo sed -i 's/peer/trust/g; s/ident/trust/g; s/scram-sha-256/trust/g; s/md5/trust/g' /var/lib/pgsql/data/pg_hba.conf
sudo systemctl restart postgresql

# Meilisearch（本地下载后 scp 到服务器 /usr/local/bin/meilisearch）
sudo chmod +x /usr/local/bin/meilisearch
nohup /usr/local/bin/meilisearch --master-key=your-master-key --http-addr 127.0.0.1:7700 > /dev/null 2>&1 &

# Nginx（Alibaba Cloud Linux 可能 exclude 了 nginx）
sudo dnf install -y --disableexcludes=all nginx
sudo systemctl enable nginx && sudo systemctl start nginx
```

---

## 3. 项目部署

```bash
git clone <your-repo-url> rainy-cole && cd rainy-cole

# 环境变量
cp .env.example .env
# 编辑 .env，必改项：
#   DATABASE_URL=postgresql://postgres:your-password@localhost:5432/rainy_cole?schema=public
#   MEILI_MASTER_KEY=your-master-key
#   MEILI_HOST=http://localhost:7700
#   UPLOAD_DIR=/var/www/rainy-cole/uploads
#   JWT_ACCESS_SECRET=<随机字符串>
#   JWT_REFRESH_SECRET=<随机字符串>

# 构建
pnpm install && pnpm build
pnpm db:deploy && pnpm db:seed
```

### 3.1 配置 Nginx

```bash
# 将构建产物放到 nginx 可访问路径（不能用 /root，nginx 无权访问）
sudo mkdir -p /var/www/rainy-cole/uploads
sudo cp -r apps/web/dist/* /var/www/rainy-cole/
sudo cp -r apps/admin/dist /var/www/rainy-cole/admin/
sudo cp -r apps/api/uploads/* /var/www/rainy-cole/uploads/ 2>/dev/null

# 安装 nginx 配置
# Ubuntu: /etc/nginx/sites-available/ → sites-enabled/
# CentOS: /etc/nginx/conf.d/
sudo cp infra/nginx/rainy-cole.conf /etc/nginx/conf.d/rainy-cole.conf

# 清理冲突配置
sudo rm -f /etc/nginx/conf.d/default.conf
sudo rm -f /etc/nginx/conf.d/website.conf
# 如果 /etc/nginx/nginx.conf 里有默认 server 块，注释掉

sudo nginx -t && sudo systemctl reload nginx
```

### 3.2 启动 API

```bash
npm install -g pm2
pm2 start apps/api/dist/src/main.js --name rainy-cole-api
pm2 save && pm2 startup
```

默认管理员账号：`admin` / `123456`

---

## 4. 验证

```bash
curl http://127.0.0.1:3000/api/health      # API
curl http://127.0.0.1:80/api/health         # Nginx → API
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:80/       # 前台（应 200）
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:80/admin/ # 后台（应 200）
```

---

## 5. 路由规则

| 路径 | 处理方式 |
|---|---|
| `/` | 静态文件 → `/var/www/rainy-cole/` |
| `/admin/` | 静态文件 → `/var/www/rainy-cole/admin/` |
| `/api/` | 反向代理 → `127.0.0.1:3000` |
| `/uploads/` | 静态文件 → `/var/www/rainy-cole/uploads/` |

---

## 6. 日常发布

```bash
cd rainy-cole
git pull && pnpm install && pnpm build && pm2 restart rainy-cole-api

# 更新前端静态文件
sudo cp -r apps/web/dist/* /var/www/rainy-cole/
sudo cp -r apps/admin/dist /var/www/rainy-cole/admin/
```

Prisma schema 变更时：

```bash
pnpm db:deploy
```

---

## 7. 常见问题

### 7.1 /api/ 502

```bash
pm2 status                    # API 是否在线
sudo tail /var/log/nginx/error.log
curl http://127.0.0.1:3000/api/health  # 绕过 nginx 直连
```

### 7.2 前端 500 / 403

- 确认 `/var/www/rainy-cole/` 路径存在且 nginx 用户可读
- 不要将代码放在 `/root` 下供 nginx 访问
- 检查 `/etc/nginx/conf.d/` 是否有残留配置文件冲突
- 检查 `/etc/nginx/nginx.conf` 是否有默认 server 块

### 7.3 上传图片 404

- 确认 `UPLOAD_DIR=/var/www/rainy-cole/uploads`
- 旧图片需手动拷贝到该目录
- nginx 配置中 `location /uploads/` 的 alias 路径正确

### 7.4 阿里云安全组

控制台放行端口：**80**（HTTP）、**443**（HTTPS）

数据库和 Meilisearch 只监听 `127.0.0.1`，不对公网开放。

### 7.5 HTTPS

获取证书后，在 nginx 配置中添加 SSL 指令，HTTP 80 重定向到 HTTPS 443。

### 7.6 Meilisearch 重启

```bash
pkill meilisearch
nohup /usr/local/bin/meilisearch --master-key=your-master-key --http-addr 127.0.0.1:7700 > /dev/null 2>&1 &
```
