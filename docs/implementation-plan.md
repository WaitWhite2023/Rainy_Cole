# 技术方案与一周实施计划

## 1. 技术选型

- Monorepo：`pnpm workspace` + `Turborepo`
- 前端：`Vue 3` + `TypeScript` + `Vite` + `Pinia` + `Element Plus` + `Tailwind CSS`
- 后端：`NestJS` + `Prisma` + `PostgreSQL`
- 搜索：`Meilisearch`
- 部署：`Docker Compose` + `Nginx`

## 2. 目录结构

```text
.
├── apps
│   ├── admin
│   ├── api
│   └── web
├── content
│   └── posts
├── docs
├── infra
│   └── docker
└── packages
    ├── config
    └── shared
```

## 3. 模块拆分

### 3.1 前台 `apps/web`

- 首页
- 文章列表页
- 文章详情页
- 分类与标签页
- 搜索页
- 关于页

### 3.2 后台 `apps/admin`

- 登录页
- 仪表盘
- 文章管理
- 分类管理
- 标签管理
- 资源管理
- 用户管理
- 站点设置

### 3.3 后端 `apps/api`

- `auth`
- `users`
- `roles`
- `posts`
- `categories`
- `tags`
- `upload`
- `site`
- `search`
- `content-sync`

## 4. 数据流约定

1. 后台文章直接写入数据库。
2. Markdown 文章通过同步任务读取 `content/posts` 后写入数据库。
3. 已发布文章同步到 Meilisearch。
4. 前台统一从 API 获取文章数据，不直接读取 Markdown 文件。

## 5. 一周开发排期

### Day 1

- 落需求与方案文档
- 初始化 Monorepo
- 建立 `web`、`admin`、`api`、`shared` 基础结构

### Day 2

- 设计 Prisma Schema
- 建立迁移与种子数据
- 连接 PostgreSQL

### Day 3

- 实现 JWT 登录与 RBAC
- 完成文章 / 分类 / 标签基础 CRUD
- 前台完成基础页面骨架

### Day 4

- 完成后台登录与路由守卫
- 完成文章编辑页和资源上传
- 完成站点设置页

### Day 5

- 完成 Markdown 同步
- 接入 Meilisearch
- 完成前台搜索与筛选页面

### Day 6

- 补 Dockerfile 与 Compose
- 完成 Nginx 路由配置
- 做本地联调与部署演练

### Day 7

- 补测试
- 修复问题
- 补部署与验收文档

## 6. 开发约束

- 若实现偏离文档，先更新文档再改代码
- 首版优先保证主链路闭环，不做无关重构
- 接口 DTO 与共享类型统一放在 `packages/shared`
