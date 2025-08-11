# SimpleReads 数据库设计文档

## 用户权限系统

### 用户类型
1. **Reader (读者)**
   - 可以CRUD自己的profile
   - 可以CRUD自己的书评
   - 可以收藏/取消收藏图书
   - 可以关注/取消关注其他用户

2. **Writer (书评人)**
   - 拥有Reader的全部权限
   - 书评和用户名在前端有专属标识（writerBadge: true）
   - 拥有expertise字段标明专长领域

3. **Admin (管理员)**
   - 拥有Writer的全部权限
   - 可以CRUD所有用户的账号和profile
   - 可以CRUD所有用户的评论
   - 拥有系统管理权限

## 数据模型

### 用户表 (Users)
```javascript
{
  _id: String,           // 用户ID
  username: String,      // 用户名（唯一）
  email: String,         // 邮箱（唯一）
  password: String,      // 加密后的密码
  role: String,          // 用户角色：'reader'/'writer'/'admin'
  avatar: String,        // 头像URL
  bio: String,           // 个人简介
  writerBadge: Boolean,  // 书评人标识（仅writer/admin为true）
  expertise: [String],   // 专长领域（仅writer/admin有效）
  createdAt: Date,       // 创建时间
  lastLoginAt: Date      // 最后登录时间
}
```

### 图书表 (Books)
```javascript
{
  _id: String,           // 内部书籍ID
  googleId: String,      // Google Books API ID（唯一）
  title: String,         // 书名
  authors: [String],     // 作者列表
  thumbnail: String,     // 封面图片URL
  description: String,   // 书籍描述
  publishedDate: String, // 出版日期
  categories: [String],  // 分类
  pageCount: Number,     // 页数
  language: String,      // 语言
  createdAt: Date        // 添加到系统的时间
}
```

### 书评表 (Reviews)
```javascript
{
  _id: String,           // 书评ID
  book: String,          // 关联的书籍ID
  user: String,          // 作者用户ID
  rating: Number,        // 评分（1-5星）
  title: String,         // 书评标题
  content: String,       // 书评内容
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 最后更新时间
}
```

### 收藏表 (Favorites)
```javascript
{
  _id: String,           // 收藏记录ID
  user: String,          // 用户ID
  book: String,          // 书籍ID
  addedAt: Date          // 收藏时间
}
```

### 关注表 (Follows)
```javascript
{
  _id: String,           // 关注记录ID
  follower: String,      // 关注者用户ID
  following: String,     // 被关注者用户ID
  createdAt: Date        // 关注时间
}
```

## 数据关系

### 一对多关系
- 一个用户 → 多个书评 (User -> Reviews)
- 一本书 → 多个书评 (Book -> Reviews)

### 多对多关系
- 用户 ↔ 图书 (通过Favorites表)
- 用户 ↔ 用户 (通过Follows表)

## 样本数据说明

### 用户数据
- **Readers**: john_reader, alice_reader, emma_reader, lily_reader
- **Writers**: mike_writer, sarah_writer, david_writer (拥有专长领域和writer标识)
- **Admin**: admin_tom (系统管理员)

### 书籍数据
包含6本经典书籍：
1. 三体 (刘慈欣) - 中文科幻
2. The Silent Patient - 心理悬疑
3. The Catcher in the Rye - 经典文学
4. To Kill a Mockingbird - 美国文学
5. Dune - 科幻史诗
6. 1984 - 反乌托邦小说

### 书评数据
- 包含10条书评，涵盖不同用户对不同书籍的评价
- Writer用户的书评更专业和详细
- Reader用户的书评更贴近普通读者体验

### 关系数据
- 收藏关系：用户收藏自己喜欢的书籍
- 关注关系：Reader关注Writer，Writer之间互相关注

## API接口权限

### 认证相关
- POST /api/auth/register - 注册时选择用户角色
- POST /api/auth/login - 登录验证
- GET /api/auth/check - 检查登录状态

### 用户相关
- GET /api/profile - 获取当前用户资料
- PUT /api/profile - 更新自己的资料
- GET /api/profile/:userId - 查看其他用户资料（公开信息）
- DELETE /api/users/:userId - 删除用户（仅Admin）

### 书评相关
- POST /api/reviews - 发布书评（需登录）
- GET /api/reviews/book/:bookId - 获取某书的所有书评
- PUT /api/reviews/:reviewId - 更新书评（本人或Admin）
- DELETE /api/reviews/:reviewId - 删除书评（本人或Admin）

### 收藏和关注
- POST/DELETE /api/favorites/:bookId - 收藏/取消收藏
- POST/DELETE /api/follow/:userId - 关注/取消关注

## 使用说明

1. 导入数据库模块：
```javascript
import Database from './Database/index.js';
import { getUserProfile, getBookDetails } from './Database/utils.js';
```

2. 获取用户信息：
```javascript
const userProfile = getUserProfile('user001');
// 返回用户信息及统计数据
```

3. 获取书籍详情：
```javascript
const bookDetails = getBookDetails('book001');
// 返回书籍信息及相关书评
```

4. 权限检查：
```javascript
import { checkUserPermission } from './Database/utils.js';
const canEdit = checkUserPermission(currentUserId, targetUserId, 'edit_own_profile');
```
