# AI Translation Setup Guide for Deenly v2

## 🚀 Overview

This guide explains how to enable AI translations for khutbahs in your Deenly platform using OpenAI's GPT models.

## 📋 Prerequisites

### 1. OpenAI API Key

- Go to [OpenAI Platform](https://platform.openai.com)
- Create an account or sign in
- Navigate to API Keys section
- Create a new API key
- **Important**: Keep this key secure and never commit it to version control

### 2. Environment Variables

Add your OpenAI API key to your environment:

**For Local Development (.env.local):**

```env
OPENAI_API_KEY=your-openai-api-key-here
```

**For Vercel Deployment:**

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `OPENAI_API_KEY` = `your-openai-api-key-here`

**For Other Hosting:**
Add the environment variable according to your hosting provider's documentation.

## 🛠️ Implementation

### 1. Database Schema

Your database already supports translations with these fields:

- `title_translations` (JSONB) - Stores translated titles
- `translation_map` (JSONB) - Stores full content translations

### 2. Backend Functions

The following functions are available in `/app/actions.ts`:

#### `translateKhutbah(title, content, sourceLanguage)`

- Translates both title and content using AI
- Returns translations for all supported languages
- Handles rate limiting and error recovery

#### `createLecture(lectureData, enableAITranslation)`

- Creates a new lecture with optional AI translations
- Set `enableAITranslation: true` to auto-translate

### 3. Supported Languages

- **English** (en) - Default
- **German** (de) - Deutsch
- **Turkish** (tr) - Türkçe
- **Arabic** (ar) - العربية
- **French** (fr) - Français
- **Spanish** (es) - Español
- **Russian** (ru) - Русский

## 📝 Usage Examples

### 1. Using the SQL Script (Database Admin)

Run the pre-made script with sample translations:

```sql
-- Use this file in Supabase SQL Editor
\i INSERT_SAMPLE_KHUTBAH_WITH_AI_TRANSLATIONS.sql
```

### 2. Using the JavaScript Service

```javascript
// Load the AI translation service
const { translateKhutbah } = require("./ai-translation-service.js");

// Translate a khutbah
const result = await translateKhutbah(
  "The Importance of Teaching Children the Qur'an",
  "Your khutbah content here...",
  "en", // source language
  process.env.OPENAI_API_KEY,
  ["de", "tr", "ar"] // target languages
);

console.log("Translations:", result.translations);
```

### 3. Using the Backend API

```javascript
// In your frontend component
const createKhutbahWithTranslations = async (khutbahData) => {
  const result = await createLecture({
    ...khutbahData,
    enableAITranslation: true, // Enable AI translations
  });

  return result;
};
```

## 🔧 Configuration

### Translation Quality Settings

Modify these settings in `ai-translation-service.js`:

```javascript
const AI_TRANSLATION_CONFIG = {
  MODEL: "gpt-3.5-turbo", // or 'gpt-4' for better quality
  MAX_TOKENS: 2000, // Increase for longer content
  TEMPERATURE: 0.3, // Lower = more consistent, Higher = more creative
};
```

### Rate Limiting

- Default delay: 1 second between API calls
- For heavy usage, consider upgrading to OpenAI Pro
- Monitor your API usage in OpenAI dashboard

## 💰 Cost Considerations

### OpenAI Pricing (as of 2025)

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **GPT-4**: ~$0.03 per 1K tokens

### Cost Estimation

- Average khutbah (~2000 words): ~3000 tokens
- Translation to 6 languages: ~18,000 tokens
- **Estimated cost per khutbah**: $0.03-0.54 (depending on model)

## 🔍 Testing & Troubleshooting

### 1. Test AI Translation Service

```javascript
// Run this in browser console or Node.js
console.log("Testing AI translations...");
// Check ai-translation-service.js for test functions
```

### 2. Verify Database Translations

```sql
-- Check if translations are stored correctly
SELECT
  title,
  title_translations,
  jsonb_object_keys(translation_map) as available_translations
FROM lectures
WHERE title_translations IS NOT NULL;
```

### 3. Common Issues

**Issue**: "OpenAI API key not found"
**Solution**: Verify environment variable is set correctly

**Issue**: "Rate limit exceeded"  
**Solution**: Add delays between API calls or upgrade OpenAI plan

**Issue**: "Translation quality poor"
**Solution**: Switch to GPT-4 model or adjust temperature settings

## 🚦 Next Steps

1. **Setup**: Add OpenAI API key to environment
2. **Test**: Run the sample SQL script with translations
3. **Deploy**: Update your production environment variables
4. **Monitor**: Track API usage and costs
5. **Optimize**: Adjust settings based on quality needs

## 🔐 Security Best Practices

- Never commit API keys to version control
- Use environment variables for all secrets
- Monitor API usage regularly
- Implement rate limiting in production
- Consider caching translations to avoid re-translating

## 📞 Support

If you need help with AI translations:

1. Check OpenAI API documentation
2. Review error logs in Supabase
3. Test with simple content first
4. Verify API key permissions

---

**Ready to start?** Run the `INSERT_SAMPLE_KHUTBAH_WITH_AI_TRANSLATIONS.sql` script to see AI translations in action! 🎉
