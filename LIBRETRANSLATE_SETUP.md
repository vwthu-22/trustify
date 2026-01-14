# LibreTranslate Self-Hosted Setup

## Quick Start

### 1. Start LibreTranslate with Docker

```bash
cd e:\Trustify
docker-compose -f docker-compose.libretranslate.yml up -d
```

### 2. Verify it's running

Open browser: http://localhost:5001

### 3. Configure environment variable

Create `my_user/.env.local` (if not exists):

```env
LIBRETRANSLATE_URL=http://localhost:5001
```

### 4. Restart Next.js dev server

```bash
cd my_user
npm run dev
```

## Docker Commands

**Start:**
```bash
docker-compose -f docker-compose.libretranslate.yml up -d
```

**Stop:**
```bash
docker-compose -f docker-compose.libretranslate.yml down
```

**View logs:**
```bash
docker-compose -f docker-compose.libretranslate.yml logs -f
```

**Restart:**
```bash
docker-compose -f docker-compose.libretranslate.yml restart
```

## Production Deployment

For production, deploy LibreTranslate to a server and update:

```env
LIBRETRANSLATE_URL=https://your-libretranslate-domain.com
```

## Benefits

✅ **Unlimited translations** - No rate limits
✅ **High quality** - Better than free APIs
✅ **Privacy** - Your data stays on your server
✅ **Free** - No API costs
✅ **Fast** - Local network speed

## Supported Languages

- Vietnamese (vi)
- English (en)
- Russian (ru)
- Japanese (ja)
- Chinese (zh)
- Portuguese (pt)
- And 100+ more languages!
