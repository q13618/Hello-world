# My Blog

一个简单的个人博客，支持文字、图片和短视频。

## 功能

- 📝 发布文字文章
- 📷 上传图片配文
- 🎬 上传短视频配文
- 🔐 密码保护的管理后台
- 📱 移动端友好

## 部署到 Vercel

### 第一步：创建 Vercel Blob 存储

1. 进入 Vercel 项目页面 → **Storage** 标签
2. 点击 **Create Database** → 选择 **Blob**
3. 创建后 Token 会自动加到环境变量

### 第二步：设置环境变量

在 Vercel 项目 → **Settings** → **Environment Variables** 中添加：

| 变量名 | 说明 |
|--------|------|
| `ADMIN_PASSWORD` | 管理后台密码（自己设置） |
| `JWT_SECRET` | 任意一段随机长字符串 |
| `BLOB_READ_WRITE_TOKEN` | 上一步自动生成 |

### 第三步：重新部署

设置完环境变量后，触发一次重新部署即可。

## 本地开发

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local 填写实际值
npm run dev
```

## 页面路径

- `/` — 博客首页（公开）
- `/admin` — 管理后台登录
- `/admin/dashboard` — 内容管理
- `/admin/new` — 发布新内容
