# 🔐 GitHub Secrets Configuration

## 📋 **Cần cấu hình các secrets sau trong GitHub:**

### 1. **VERCEL_TOKEN**
- **Mô tả:** Token để xác thực với Vercel
- **Cách lấy:**
  1. Vào [Vercel Dashboard](https://vercel.com/account/tokens)
  2. Tạo token mới
  3. Copy token

### 2. **VERCEL_ORG_ID**
- **Mô tả:** ID của organization Vercel
- **Cách lấy:**
  1. Vào [Vercel Dashboard](https://vercel.com/account)
  2. Vào Settings > General
  3. Copy Organization ID

### 3. **VERCEL_PROJECT_ID**
- **Mô tả:** ID của project Vercel
- **Cách lấy:**
  1. Vào project trên Vercel
  2. Vào Settings > General
  3. Copy Project ID

## 🔧 **Cách cấu hình trong GitHub:**

1. **Vào repository** trên GitHub
2. **Vào Settings** > **Secrets and variables** > **Actions**
3. **Click "New repository secret"**
4. **Thêm từng secret** với tên và giá trị tương ứng

## ✅ **Sau khi cấu hình:**

- GitHub Actions sẽ tự động deploy khi push code
- Chỉ deploy khi có thay đổi quan trọng
- Không cần chạy script thủ công

## 🚨 **Lưu ý bảo mật:**

- **Không commit** secrets vào code
- **Không chia sẻ** tokens với người khác
- **Rotate tokens** định kỳ

## 🔍 **Kiểm tra cấu hình:**

```bash
# Kiểm tra secrets đã cấu hình
gh secret list

# Hoặc xem trong GitHub UI
# Settings > Secrets and variables > Actions
```
