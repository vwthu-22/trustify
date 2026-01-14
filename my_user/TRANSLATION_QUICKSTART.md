# 🌐 Translation Service - Quick Start

## ✅ Đã Setup Xong!

Hệ thống translation đã được cấu hình để sử dụng **LibreTranslate** (miễn phí, không giới hạn).

## 🚀 Sử dụng Ngay

**Không cần làm gì thêm!** Hệ thống sẽ tự động:
1. Sử dụng LibreTranslate public API (miễn phí)
2. Nếu LibreTranslate fail → tự động chuyển sang Google Translate

## 🔧 Tùy Chỉnh (Optional)

Tạo file `.env.local` trong thư mục `my_user`:

```bash
# Mặc định: LibreTranslate (miễn phí, không cần API key)
TRANSLATION_ENGINE=libre
LIBRE_TRANSLATE_URL=https://libretranslate.com

# Hoặc dùng Google Translate
# TRANSLATION_ENGINE=google
# GOOGLE_TRANSLATE_API_KEY=your_key_here
```

## 🐳 Chạy LibreTranslate Local (Optional)

Nếu muốn tự host để riêng tư hơn:

1. **Mở Docker Desktop**

2. **Chạy container:**
   ```bash
   cd e:\Trustify
   docker-compose -f docker-compose.libretranslate.yml up -d
   ```

3. **Cập nhật `.env.local`:**
   ```bash
   LIBRE_TRANSLATE_URL=http://localhost:5001
   ```

## 📊 So Sánh Engines

| Engine | Miễn Phí | Tiếng Việt | Chất Lượng |
|--------|----------|------------|------------|
| **LibreTranslate** (Public) | ✅ Unlimited | ✅ | ⭐⭐⭐ |
| **LibreTranslate** (Docker) | ✅ Unlimited | ✅ | ⭐⭐⭐ |
| **Google Translate** | ⚠️ Limited | ✅ | ⭐⭐⭐⭐ |
| **DeepL** | ⚠️ 500k/month | ❌ | ⭐⭐⭐⭐⭐ |

## 🧪 Test

```bash
# Chạy dev server
npm run dev

# Test API (trong terminal khác)
node test-translation.js
```

## 📚 Chi Tiết

Xem file `TRANSLATION_SETUP.md` để biết thêm chi tiết.
