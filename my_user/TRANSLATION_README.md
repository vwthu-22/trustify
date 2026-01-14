# 🌐 Translation Service - Complete Setup

> **Status:** ✅ Hoàn thành và sẵn sàng sử dụng  
> **Default Engine:** LibreTranslate (Free, Unlimited)  
> **Fallback:** Google Translate (Automatic)

---

## 📋 Tóm Tắt Nhanh

Hệ thống translation đã được setup với:

- ✅ **LibreTranslate** làm engine mặc định (miễn phí, không giới hạn)
- ✅ **Automatic fallback** sang Google Translate nếu có lỗi
- ✅ **Hỗ trợ 4 engines**: LibreTranslate, Google, DeepL, Yandex
- ✅ **Flexible configuration** qua environment variables
- ✅ **Docker support** cho self-hosting
- ✅ **Đầy đủ documentation** và test scripts

---

## 🚀 Quick Start

### Sử dụng ngay (Không cần setup)

Hệ thống đã được cấu hình sẵn để sử dụng LibreTranslate public API:

```bash
cd my_user
npm run dev
```

**Xong!** Translation đã hoạt động ngay.

### Test

```bash
node test-translation.js
```

---

## 📊 Architecture

![Translation Architecture](translation_architecture.png)

### Luồng Hoạt Động:

1. User click nút "Translate"
2. Frontend gọi `/api/translate`
3. Hệ thống thử dùng **LibreTranslate** trước
4. Nếu thành công → Trả về kết quả
5. Nếu thất bại → Tự động chuyển sang **Google Translate**
6. Hiển thị kết quả cho user

---

## 🔧 Configuration

### Default (Không cần làm gì)

Hệ thống sử dụng LibreTranslate public API:
- URL: `https://libretranslate.com`
- Không cần API key
- Miễn phí, không giới hạn

### Custom Configuration

Tạo file `.env.local` trong `my_user/`:

```bash
# Chọn engine: 'libre', 'google', 'deepl', 'yandex'
TRANSLATION_ENGINE=libre

# LibreTranslate settings
LIBRE_TRANSLATE_URL=https://libretranslate.com
# LIBRE_TRANSLATE_KEY=  # Optional

# Google Translate (nếu dùng)
# GOOGLE_TRANSLATE_API_KEY=your_key

# DeepL (nếu dùng)
# DEEPL_KEY=your_key

# Yandex (nếu dùng)
# YANDEX_KEY=your_key
```

---

## 🐳 Self-Hosting với Docker

### Tại sao nên self-host?

- 🔒 **Privacy**: Dữ liệu không gửi ra ngoài
- ⚡ **Performance**: Nhanh hơn, không phụ thuộc public API
- 🎯 **Control**: Kiểm soát hoàn toàn

### Cách Setup:

#### 1. Khởi động Docker Desktop

#### 2. Start LibreTranslate

**Option A: Dùng script helper (Khuyến nghị)**
```powershell
.\libretranslate.ps1 start
```

**Option B: Dùng docker-compose**
```bash
docker-compose -f docker-compose.libretranslate.yml up -d
```

#### 3. Cấu hình

Tạo/cập nhật `.env.local`:
```bash
TRANSLATION_ENGINE=libre
LIBRE_TRANSLATE_URL=http://localhost:5001
```

#### 4. Restart dev server

```bash
cd my_user
npm run dev
```

#### 5. Verify

- Mở http://localhost:5001 → Thấy LibreTranslate UI
- Chạy `node test-translation.js` → Thấy kết quả dịch

### Quản lý Docker Container

```powershell
# Xem status
.\libretranslate.ps1 status

# Xem logs
.\libretranslate.ps1 logs

# Stop
.\libretranslate.ps1 stop

# Restart
.\libretranslate.ps1 restart
```

---

## 📊 So Sánh Engines

![Translation Engines Comparison](translation_engines_comparison.png)

| Engine | Chi Phí | API Key | Tiếng Việt | Chất Lượng | Giới Hạn |
|--------|---------|---------|------------|------------|----------|
| **LibreTranslate (Public)** ⭐ | Miễn phí | ❌ Không | ✅ Có | ⭐⭐⭐⭐ | ♾️ Unlimited |
| **LibreTranslate (Docker)** | Miễn phí | ❌ Không | ✅ Có | ⭐⭐⭐⭐ | ♾️ Unlimited |
| **Google Translate** | Paid | ⚠️ Optional | ✅ Có | ⭐⭐⭐⭐ | ⚠️ Limited |
| **DeepL** | Paid | ✅ Có | ❌ Không | ⭐⭐⭐⭐⭐ | ⚠️ 500k/month |

⭐ = Khuyến nghị cho development

---

## 🧪 Testing

### Test API Endpoint

```bash
# Chạy dev server
cd my_user
npm run dev

# Trong terminal khác
node test-translation.js
```

**Expected Output:**
```
✅ Translation successful!
📝 Original text: Hello world
🌐 Translated text: Xin chào thế giới
🔧 Engine used: libre
🗣️  Source language: en
🎯 Target language: vi
```

### Test trong App

1. Mở app: http://localhost:3000
2. Tìm review có nút "Translate"
3. Click "Translate"
4. Verify translation hiển thị đúng

---

## 📁 File Structure

```
e:\Trustify\
├── my_user\
│   ├── src\
│   │   └── app\
│   │       └── api\
│   │           └── translate\
│   │               └── route.ts              ← Translation API
│   ├── TRANSLATION_QUICKSTART.md             ← Quick start (VI)
│   ├── TRANSLATION_SETUP.md                  ← Detailed guide (EN)
│   └── test-translation.js                   ← Test script
├── docker-compose.libretranslate.yml         ← Docker config
├── libretranslate.ps1                        ← Docker helper script
└── TRANSLATION_SUMMARY.md                    ← This file
```

---

## 🎯 Khuyến Nghị

### Development
✅ **LibreTranslate Public** (Default)
- Không cần setup
- Miễn phí, unlimited
- Đủ tốt cho development

### Production

**Option 1: LibreTranslate Docker (Khuyến nghị)**
- ✅ Miễn phí, unlimited
- ✅ Riêng tư, tự kiểm soát
- ✅ Không phụ thuộc bên thứ 3

**Option 2: Google Translate API**
- ✅ Chất lượng cao, ổn định
- ⚠️ Tốn phí sau free tier
- ✅ Hỗ trợ tốt

---

## 🔍 Troubleshooting

### Translation không hoạt động

1. **Check dev server:**
   ```bash
   # Server có đang chạy không?
   curl http://localhost:3000
   ```

2. **Check logs:**
   ```bash
   # Xem console logs trong terminal chạy dev server
   ```

3. **Test API trực tiếp:**
   ```bash
   node test-translation.js
   ```

### LibreTranslate Docker không start

1. **Check Docker Desktop:**
   - Mở Docker Desktop
   - Verify nó đang chạy

2. **Check logs:**
   ```powershell
   .\libretranslate.ps1 logs
   ```

3. **Restart:**
   ```powershell
   .\libretranslate.ps1 restart
   ```

### Fallback sang Google Translate

Nếu thấy log: `"Falling back to Google Translate..."`

**Nguyên nhân:**
- LibreTranslate public API đang down/chậm
- Network issue
- Rate limiting

**Giải pháp:**
- ✅ Hệ thống tự động fallback, không cần làm gì
- 💡 Nếu muốn ổn định hơn → Chạy LibreTranslate Docker

---

## 📚 Documentation

- **Quick Start (VI):** `TRANSLATION_QUICKSTART.md`
- **Detailed Setup (EN):** `TRANSLATION_SETUP.md`
- **Summary (VI):** `TRANSLATION_SUMMARY.md`

---

## 🎊 Kết Luận

Hệ thống translation đã **hoàn thành** và **sẵn sàng sử dụng**!

**Highlights:**
- ✅ Miễn phí & Unlimited (LibreTranslate)
- ✅ Reliable (Auto fallback)
- ✅ Flexible (4 engines support)
- ✅ Self-hostable (Docker ready)
- ✅ Well-documented

**Bạn có thể bắt đầu sử dụng ngay!** 🚀

---

## 📞 Support

Nếu có vấn đề:
1. Đọc `TRANSLATION_SETUP.md` để biết chi tiết
2. Chạy `node test-translation.js` để debug
3. Check logs trong dev server console

---

**Made with ❤️ for Trustify**
