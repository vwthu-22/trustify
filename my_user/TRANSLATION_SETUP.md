# Translation Service Configuration

## Quick Start

By default, the translation service uses **LibreTranslate** (free, unlimited, no API key required).

## Environment Variables

Add these to your `.env.local` file:

```bash
# Translation Engine Selection
# Options: 'libre', 'google', 'deepl', 'yandex'
# Default: 'libre'
TRANSLATION_ENGINE=libre

# LibreTranslate Configuration
# Public instance (free, no API key needed)
LIBRE_TRANSLATE_URL=https://libretranslate.com

# OR use your local Docker instance:
# LIBRE_TRANSLATE_URL=http://localhost:5001
# LIBRE_TRANSLATE_KEY=  # Optional, only needed for some instances

# Google Translate API Key (if using TRANSLATION_ENGINE=google)
# GOOGLE_TRANSLATE_API_KEY=your_key_here

# DeepL API Key (if using TRANSLATION_ENGINE=deepl)
# Free tier: 500,000 characters/month
# Note: DeepL doesn't support Vietnamese
# DEEPL_KEY=your_key_here

# Yandex Translate API Key (if using TRANSLATION_ENGINE=yandex)
# YANDEX_KEY=your_key_here
```

## Using Local LibreTranslate with Docker

1. **Start Docker Desktop** (if not running)

2. **Run LibreTranslate container:**
   ```bash
   docker-compose -f docker-compose.libretranslate.yml up -d
   ```

3. **Update your `.env.local`:**
   ```bash
   TRANSLATION_ENGINE=libre
   LIBRE_TRANSLATE_URL=http://localhost:5001
   ```

4. **Verify it's running:**
   - Open http://localhost:5001 in your browser
   - You should see the LibreTranslate web interface

## Translation Engines Comparison

| Engine | Cost | API Key Required | Vietnamese Support | Quality | Notes |
|--------|------|------------------|-------------------|---------|-------|
| **LibreTranslate** (Public) | Free | No | ✅ Yes | Good | Default, unlimited |
| **LibreTranslate** (Docker) | Free | No | ✅ Yes | Good | Self-hosted, private |
| **Google Translate** | Free tier + paid | Optional | ✅ Yes | Very Good | Fallback option |
| **DeepL** | 500k chars/month free | Yes | ❌ No | Excellent | Best quality, limited languages |
| **Yandex** | Free tier + paid | Yes | ✅ Yes | Good | - |

## Fallback Mechanism

The system automatically falls back to Google Translate if the primary engine fails:

1. **Try primary engine** (e.g., LibreTranslate)
2. **If fails** → Automatically switch to Google Translate
3. **Return result** with engine info

This ensures translation always works, even if LibreTranslate is down.

## Testing

Test the translation API:

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello world",
    "targetLang": "vi",
    "sourceLang": "en"
  }'
```

Expected response:
```json
{
  "translatedText": "Xin chào thế giới",
  "engine": "libre",
  "sourceLanguage": "en",
  "targetLanguage": "vi"
}
```
