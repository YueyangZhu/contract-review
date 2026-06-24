# 部署指南：Vercel + Render + Supabase

## 一、准备工作

### 1. 注册账号
- [GitHub](https://github.com)
- [Vercel](https://vercel.com)（可用 GitHub 账号登录）
- [Render](https://render.com)（可用 GitHub 账号登录）
- [Supabase](https://supabase.com)（可用 GitHub 账号登录）

### 2. 创建 GitHub 仓库
1. 登录 GitHub，点击右上角 `+` → `New repository`
2. 仓库名填 `contract-review`
3. 选择 `Public` 或 `Private`
4. 不要勾选 README，保持空仓库

### 3. 推送代码到 GitHub
在本地项目根目录执行：

```bash
git init
git add .
git commit -m "init: contract review system"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/contract-review.git
git push -u origin main
```

---

## 二、部署后端到 Render

### 1. 创建 Render 数据库
1. 登录 [Render Dashboard](https://dashboard.render.com)
2. 点击 `New` → `PostgreSQL`
3. 填写：
   - Name: `contract-review-db`
   - Database: `contract_review`
   - User: `contract_review`
   - Plan: `Free`
4. 点击 `Create Database`
5. 创建完成后，复制 `Internal Database URL`（格式：`postgresql://...`）

### 2. 创建 Render Web Service
1. 点击 `New` → `Web Service`
2. 选择你的 GitHub 仓库 `contract-review`
3. 填写配置：
   - Name: `contract-review-api`
   - Runtime: `Docker`
   - Root Directory: `backend`
   - Branch: `main`
4. 环境变量：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | 上面复制的 PostgreSQL URL |
| `SECRET_KEY` | 随机 32 位以上字符串 |
| `LLM_PROVIDER` | `mock` |
| `FRONTEND_URL` | 先填 `*`，部署 Vercel 后改成 Vercel 域名 |
| `UPLOAD_DIR` | `/app/uploads` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` |

5. 点击 `Advanced` → `Add Disk`：
   - Name: `contract-uploads`
   - Mount Path: `/app/uploads`
   - Size: `1 GB`
6. 点击 `Create Web Service`

### 3. 获取后端地址
部署完成后，Render 会给你一个类似 `https://contract-review-api.onrender.com` 的地址，复制下来。

---

## 三、部署前端到 Vercel

### 1. 修改前端 API 地址
编辑项目根目录 `.env.production`：

```env
VITE_API_BASE_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com/api/v1
```

把 `YOUR_RENDER_BACKEND_URL` 换成你的 Render 地址。

### 2. 提交修改
```bash
git add .
git commit -m "config: production api url"
git push
```

### 3. 导入 Vercel
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 `Add New...` → `Project`
3. 选择 GitHub 仓库 `contract-review`
4. 点击 `Import`
5. 配置：
   - Framework Preset: 选择 `Vite`
   - Root Directory: `./`（保持默认）
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. 点击 `Deploy`

### 4. 获取 Vercel 域名
部署完成后，Vercel 会给你一个类似 `https://contract-review.vercel.app` 的域名，复制下来。

---

## 四、配置跨域

### 1. 更新 Render 环境变量
1. 回到 [Render Dashboard](https://dashboard.render.com)
2. 进入 `contract-review-api` → `Environment`
3. 把 `FRONTEND_URL` 从 `*` 改成你的 Vercel 域名：
   ```
   https://contract-review.vercel.app
   ```
4. 点击 `Save Changes`，Render 会自动重新部署

---

## 五、初始化数据库数据

### 方式一：Render Shell（推荐）
1. 进入 Render 后台的 `contract-review-api`
2. 点击顶部 `Shell` 标签
3. 执行：
   ```bash
   python seed.py
   ```

### 方式二：本地连接 Supabase 数据库执行
1. 在 Supabase 项目 → `Database` → `Connection string`
2. 用 psql 或 DBeaver 连接
3. 手动插入演示用户数据（参考 `backend/seed.py`）

---

## 六、验证部署

1. 访问后端健康检查：
   ```
   https://YOUR_RENDER_BACKEND_URL.onrender.com/health
   ```
   应返回 `{"status":"ok"}`

2. 访问前端登录页：
   ```
   https://YOUR_VERCEL_DOMAIN.vercel.app/login
   ```

3. 用演示账号登录：
   - 业务人员：`business` / `business123`
   - 法务人员：`legal` / `legal123`

---

## 七、常见问题

### 1. Render 免费版冷启动慢
免费版 15 分钟无访问会休眠，首次访问需要 30 秒左右唤醒。

### 2. CORS 报错
检查 Render 的 `FRONTEND_URL` 是否和 Vercel 实际域名完全一致（包括 `https://`）。

### 3. 文件上传失败
检查 Render 是否配置了 Disk，且 `UPLOAD_DIR=/app/uploads`。

### 4. 数据库连接失败
检查 `DATABASE_URL` 是否正确，格式应为：
```
postgresql://user:password@host:5432/dbname
```

---

## 八、后续优化建议

1. **HTTPS 强制**：Vercel 和 Render 默认都开启 HTTPS
2. **自定义域名**：在 Vercel/Render 设置里绑定自己的域名
3. **数据库迁移**：生产环境建议使用 Alembic 管理迁移
4. **日志监控**：Render 提供日志查看，可接入 Sentry 监控错误
5. **文件存储**：量大时建议迁到 Supabase Storage 或 AWS S3
