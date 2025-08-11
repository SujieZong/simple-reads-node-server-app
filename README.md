# SimpleReads - 轻量级书评社区

## 项目概述

SimpleReads 是一个基于 Node.js 和 Express 的书评社区平台，旨在为读者提供一个分享和发现优质书评的空间。

## 核心功能

### 用户系统

- **三种用户角色**：Reader（读者）、Writer（书评人）、Admin（管理员）
- **权限管理**：分级权限控制，确保数据安全
- **个人资料**：完整的用户档案管理

### 书评系统

- **图书搜索**：集成 Google Books API
- **书评发布**：支持评分和详细评论
- **专业标识**：Writer 用户的专业认证

### 社交功能

- **收藏系统**：收藏喜欢的书籍
- **关注系统**：关注感兴趣的用户
- **动态推送**：个性化内容推荐

## 技术栈

### 后端

- **Node.js** - 运行环境
- **Express** - Web 框架
- **JavaScript ES6+** - 编程语言

### 数据存储

- **内存数据库** - 开发阶段使用 JSON 文件
- **MongoDB** - 生产环境（规划中）

### 第三方 API

- **Google Books API** - 图书信息获取

### 开发工具

- **Nodemon** - 开发时自动重启
- **Git** - 版本控制

## 项目结构

```
simplereads-node-server-app/
├── Database/               # 数据层
│   ├── index.js           # 数据导出入口
│   ├── users.js           # 用户数据
│   ├── books.js           # 书籍数据
│   ├── reviews.js         # 书评数据
│   ├── favorites.js       # 收藏数据
│   ├── follows.js         # 关注数据
│   ├── utils.js           # 数据操作工具
│   └── README.md          # 数据库文档
├── routes/                # 路由层（待创建）
├── middleware/            # 中间件（待创建）
├── utils/                 # 工具函数（待创建）
├── index.js              # 应用入口
├── test-database.js      # 数据库测试
├── package.json          # 项目配置
├── .env.example          # 环境变量示例
├── .gitignore            # Git忽略文件
└── README.md             # 项目文档
```

## 数据模型

### 用户权限层级

1. **Reader** - 基础用户，可管理个人内容
2. **Writer** - 专业书评人，拥有认证标识
3. **Admin** - 系统管理员，拥有全部权限

### 核心实体

- **User** - 用户信息
- **Book** - 图书信息（来源于 Google Books）
- **Review** - 书评内容
- **Favorite** - 收藏关系
- **Follow** - 关注关系

## API 设计

### 认证路由

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/check` - 检查登录状态

### 用户路由

- `GET /api/profile` - 获取当前用户资料
- `PUT /api/profile` - 更新个人资料
- `GET /api/profile/:userId` - 查看他人资料

### 图书路由

- `GET /api/search?q={keyword}` - 搜索图书
- `GET /api/books/:googleId` - 获取图书详情

### 书评路由

- `POST /api/reviews` - 发布书评
- `GET /api/reviews/book/:bookId` - 获取图书书评
- `PUT /api/reviews/:reviewId` - 更新书评
- `DELETE /api/reviews/:reviewId` - 删除书评

### 社交路由

- `POST /api/favorites/:bookId` - 收藏图书
- `DELETE /api/favorites/:bookId` - 取消收藏
- `GET /api/favorites` - 我的收藏
- `POST /api/follow/:userId` - 关注用户
- `DELETE /api/follow/:userId` - 取消关注

## 开发计划

### Day 1-2: 后端基础

- [x] 数据库模型设计
- [x] 样本数据创建
- [ ] 基础 Express 应用搭建
- [ ] 认证中间件实现

### Day 3-4: API 开发

- [ ] 用户管理 API
- [ ] 书评 CRUD API
- [ ] Google Books API 集成
- [ ] 社交功能 API

### Day 5: 前端基础

- [ ] React 应用搭建
- [ ] 核心页面开发
- [ ] 用户界面实现

### Day 6: 集成与部署

- [ ] 前后端联调
- [ ] 功能测试
- [ ] 部署准备

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 测试数据库

```bash
node test-database.js
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑.env文件，填入实际配置
```

## 数据库测试结果

当前样本数据包含：

- 8 个用户（4 个 Reader + 3 个 Writer + 1 个 Admin）
- 6 本经典图书
- 10 条书评
- 14 个收藏记录
- 12 个关注关系

权限系统测试通过：

- ✓ Reader 可以编辑自己的资料
- ✗ Reader 不能编辑他人资料
- ✓ Admin 可以编辑任何用户资料

## 注意事项

1. **安全性**：生产环境需要使用强密码哈希和安全的 session 密钥
2. **API 限制**：Google Books API 有调用频率限制
3. **扩展性**：当前使用内存数据库，后续需迁移到 MongoDB
4. **性能**：大量数据时需要添加分页和缓存机制

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

ISC License

## 联系方式

- 作者：Sujie Zong
- 项目：CS5610 Web Development Final Project
