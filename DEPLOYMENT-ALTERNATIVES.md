# 🚀 Hướng dẫn Deploy Game TienLoThan trên các nền tảng khác

## 📋 **Tổng quan**

Game TienLoThan sử dụng:
- **Frontend**: Nuxt 3 (Vue.js)
- **Backend**: Nuxt Server API
- **Database**: PostgreSQL với Prisma ORM
- **Styling**: Tailwind CSS

## 🌐 **Các nền tảng được hỗ trợ**

### 1. **Railway** (Khuyến nghị - Dễ nhất)

#### **Ưu điểm:**
- Hỗ trợ PostgreSQL miễn phí
- Deploy tự động từ GitHub
- Không giới hạn deployments
- Dễ cấu hình

#### **Cách deploy:**

1. **Tạo tài khoản Railway:**
   - Truy cập: https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo project mới:**
   ```bash
   # Cài đặt Railway CLI
   npm install -g @railway/cli
   
   # Đăng nhập
   railway login
   
   # Tạo project
   railway init
   ```

3. **Cấu hình database:**
   ```bash
   # Thêm PostgreSQL service
   railway add postgresql
   
   # Lấy connection string
   railway variables
   ```

4. **Cấu hình environment variables:**
   ```bash
   # Thêm các biến môi trường
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set JWT_SECRET="your-secret-key"
   railway variables set NUXT_PUBLIC_BASE_URL="https://your-app.railway.app"
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

#### **Cấu hình cho Railway:**

Tạo file `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run build && npm run preview",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### 2. **Render** (Miễn phí với giới hạn)

#### **Ưu điểm:**
- Miễn phí 750 giờ/tháng
- Hỗ trợ PostgreSQL
- Deploy tự động

#### **Cách deploy:**

1. **Tạo tài khoản Render:**
   - Truy cập: https://render.com
   - Kết nối GitHub

2. **Tạo Web Service:**
   - Chọn repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

3. **Tạo PostgreSQL Database:**
   - Tạo PostgreSQL service
   - Copy connection string

4. **Cấu hình Environment Variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   NUXT_PUBLIC_BASE_URL=https://your-app.onrender.com
   NODE_ENV=production
   ```

---

### 3. **DigitalOcean App Platform**

#### **Ưu điểm:**
- Hiệu suất cao
- Hỗ trợ PostgreSQL
- Scaling tự động

#### **Cách deploy:**

1. **Tạo Droplet Database:**
   ```bash
   # Tạo PostgreSQL database
   doctl databases create tien-lo-than-db --engine pg --region sgp1
   ```

2. **Tạo App Platform:**
   - Truy cập: https://cloud.digitalocean.com/apps
   - Chọn "Create App"
   - Kết nối GitHub repository

3. **Cấu hình build:**
   ```yaml
   # .do/app.yaml
   name: tien-lo-than
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/tien-lo-than
       branch: main
     run_command: npm run preview
     build_command: npm install && npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DATABASE_URL
       value: ${db.DATABASE_URL}
     - key: JWT_SECRET
       value: your-secret-key
     - key: NUXT_PUBLIC_BASE_URL
       value: https://your-app.ondigitalocean.app
   databases:
   - name: db
     engine: PG
     version: "13"
   ```

---

### 4. **Heroku** (Có phí)

#### **Ưu điểm:**
- Nền tảng ổn định
- Hỗ trợ PostgreSQL
- Add-ons phong phú

#### **Cách deploy:**

1. **Cài đặt Heroku CLI:**
   ```bash
   # Windows
   winget install Heroku.HerokuCLI
   
   # Hoặc tải từ: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Tạo app:**
   ```bash
   heroku login
   heroku create tien-lo-than-game
   ```

3. **Thêm PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Cấu hình environment:**
   ```bash
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set NUXT_PUBLIC_BASE_URL="https://tien-lo-than-game.herokuapp.com"
   ```

5. **Tạo file `Procfile`:**
   ```
   web: npm run preview
   ```

6. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

### 5. **Netlify** (Chỉ Frontend)

#### **Lưu ý:** Netlify không hỗ trợ server-side rendering tốt, cần cấu hình đặc biệt.

#### **Cách deploy:**

1. **Cấu hình `nuxt.config.ts`:**
   ```typescript
   export default defineNuxtConfig({
     // ... existing config
     nitro: {
       preset: 'netlify'
     },
     ssr: false, // Chuyển sang SPA mode
     // ... rest of config
   })
   ```

2. **Tạo `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = ".output/public"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy:**
   - Kết nối GitHub với Netlify
   - Chọn repository
   - Cấu hình build settings
   - Deploy

---

### 6. **VPS/Cloud Server** (Tự quản lý)

#### **Cách deploy trên VPS:**

1. **Chuẩn bị server:**
   ```bash
   # Cài đặt Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Cài đặt PostgreSQL
   sudo apt-get install postgresql postgresql-contrib
   
   # Cài đặt PM2
   npm install -g pm2
   ```

2. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/tien-lo-than.git
   cd tien-lo-than
   npm install
   ```

3. **Cấu hình database:**
   ```bash
   # Tạo database
   sudo -u postgres createdb tien_lo_than
   
   # Cấu hình Prisma
   npx prisma db push
   npx prisma db seed
   ```

4. **Cấu hình environment:**
   ```bash
   # Tạo file .env
   echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/tien_lo_than" > .env
   echo "JWT_SECRET=your-secret-key" >> .env
   echo "NUXT_PUBLIC_BASE_URL=https://your-domain.com" >> .env
   ```

5. **Build và chạy:**
   ```bash
   npm run build
   pm2 start ecosystem.config.js
   ```

6. **Tạo file `ecosystem.config.js`:**
   ```javascript
   module.exports = {
     apps: [{
       name: 'tien-lo-than',
       script: 'npm',
       args: 'run preview',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

---

## 🔧 **Cấu hình chung cho tất cả nền tảng**

### **1. Cập nhật `nuxt.config.ts`:**

```typescript
export default defineNuxtConfig({
  // ... existing config
  nitro: {
    // Thay đổi preset tùy theo nền tảng
    preset: 'vercel', // hoặc 'netlify', 'heroku', 'node-server'
    experimental: {
      wasm: true
    }
  },
  // ... rest of config
})
```

### **2. Tạo file cấu hình cho từng nền tảng:**

#### **Railway:**
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run build && npm run preview",
    "healthcheckPath": "/api/health"
  }
}
```

#### **Render:**
```yaml
# render.yaml
services:
  - type: web
    name: tien-lo-than
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run preview
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
```

### **3. Scripts trong `package.json`:**

```json
{
  "scripts": {
    "build": "npx prisma generate && npx nuxt build",
    "preview": "npx nuxt preview",
    "start": "node .output/server/index.mjs",
    "deploy:railway": "railway up",
    "deploy:render": "git push origin main",
    "deploy:heroku": "git push heroku main"
  }
}
```

---

## 📊 **So sánh các nền tảng**

| Nền tảng | Miễn phí | PostgreSQL | Dễ deploy | Hiệu suất | Khuyến nghị |
|----------|----------|------------|-----------|-----------|-------------|
| Railway | ✅ | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Tốt nhất** |
| Render | ✅ (750h/tháng) | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Tốt |
| DigitalOcean | ❌ | ✅ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Tốt |
| Heroku | ❌ | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Tốt |
| Netlify | ✅ | ❌ | ⭐⭐⭐ | ⭐⭐ | Hạn chế |
| VPS | ❌ | ✅ | ⭐⭐ | ⭐⭐⭐⭐⭐ | Tự quản lý |

---

## 🚀 **Hướng dẫn nhanh (Railway)**

```bash
# 1. Cài đặt Railway CLI
npm install -g @railway/cli

# 2. Đăng nhập
railway login

# 3. Tạo project
railway init

# 4. Thêm database
railway add postgresql

# 5. Cấu hình biến môi trường
railway variables set JWT_SECRET="your-secret-key"
railway variables set NUXT_PUBLIC_BASE_URL="https://your-app.railway.app"

# 6. Deploy
railway up
```

---

## ⚠️ **Lưu ý quan trọng**

1. **Database**: Tất cả nền tảng đều cần PostgreSQL
2. **Environment Variables**: Cấu hình đúng các biến môi trường
3. **Build Command**: Đảm bảo chạy `prisma generate` trước khi build
4. **Port**: Một số nền tảng yêu cầu sử dụng biến `PORT`
5. **HTTPS**: Tất cả nền tảng đều hỗ trợ HTTPS tự động

Bạn muốn tôi hướng dẫn chi tiết cho nền tảng nào cụ thể?
