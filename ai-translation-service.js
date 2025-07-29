// AI Translation Service for Khutbahs
// This script can be used to generate AI translations for existing khutbahs

const AI_TRANSLATION_CONFIG = {
  // Supported languages
  LANGUAGES: {
    'en': 'English',
    'de': 'German', 
    'tr': 'Turkish',
    'ar': 'Arabic',
    'fr': 'French',
    'es': 'Spanish',
    'ru': 'Russian'
  },
  
  // OpenAI API configuration
  API_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: 2000,
  TEMPERATURE: 0.3
};

/**
 * Translates text using OpenAI API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'de', 'tr')
 * @param {string} sourceLanguage - Source language code (default: 'en')
 * @param {string} apiKey - OpenAI API key
 * @returns {Promise<string>} Translated text
 */
async function translateWithAI(text, targetLanguage, sourceLanguage = 'en', apiKey) {
  try {
    const languageName = AI_TRANSLATION_CONFIG.LANGUAGES[targetLanguage];
    if (!languageName) {
      throw new Error(`Unsupported language: ${targetLanguage}`);
    }

    const response = await fetch(AI_TRANSLATION_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_TRANSLATION_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in Islamic religious content. Translate the following text to ${languageName} while preserving:
            - Islamic terminology and concepts
            - Quranic verses (keep Arabic text with ﴿ ﴾ brackets)
            - Hadith references and attributions
            - Religious context and meaning
            - Original structure and formatting
            - Respectful tone appropriate for religious content
            
            Maintain the same paragraph breaks and structure as the original text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: AI_TRANSLATION_CONFIG.MAX_TOKENS,
        temperature: AI_TRANSLATION_CONFIG.TEMPERATURE,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || text;
    
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error);
    throw error;
  }
}

/**
 * Translates a khutbah into multiple languages
 * @param {string} title - Khutbah title
 * @param {string} content - Khutbah content
 * @param {string} sourceLanguage - Source language (default: 'en')
 * @param {string} apiKey - OpenAI API key
 * @param {string[]} targetLanguages - Languages to translate to
 * @returns {Promise<Object>} Translation results
 */
async function translateKhutbah(title, content, sourceLanguage = 'en', apiKey, targetLanguages = null) {
  // Default target languages (exclude source language)
  if (!targetLanguages) {
    targetLanguages = Object.keys(AI_TRANSLATION_CONFIG.LANGUAGES)
      .filter(lang => lang !== sourceLanguage);
  }

  console.log(`🚀 Starting AI translation for khutbah: "${title}"`);
  console.log(`📝 Source language: ${AI_TRANSLATION_CONFIG.LANGUAGES[sourceLanguage]}`);
  console.log(`🌍 Target languages: ${targetLanguages.map(lang => AI_TRANSLATION_CONFIG.LANGUAGES[lang]).join(', ')}`);

  const translations = {};
  const errors = [];

  for (const lang of targetLanguages) {
    try {
      console.log(`🔄 Translating to ${AI_TRANSLATION_CONFIG.LANGUAGES[lang]}...`);
      
      // Translate title
      const translatedTitle = await translateWithAI(title, lang, sourceLanguage, apiKey);
      
      // Translate content (split into chunks if too long)
      let translatedContent;
      if (content.length > 3000) {
        // Split content into paragraphs and translate separately
        const paragraphs = content.split('\n\n');
        const translatedParagraphs = [];
        
        for (const paragraph of paragraphs) {
          if (paragraph.trim()) {
            const translatedParagraph = await translateWithAI(paragraph, lang, sourceLanguage, apiKey);
            translatedParagraphs.push(translatedParagraph);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            translatedParagraphs.push('');
          }
        }
        
        translatedContent = translatedParagraphs.join('\n\n');
      } else {
        translatedContent = await translateWithAI(content, lang, sourceLanguage, apiKey);
      }
      
      translations[lang] = {
        title: translatedTitle,
        content: translatedContent
      };
      
      console.log(`✅ ${AI_TRANSLATION_CONFIG.LANGUAGES[lang]} translation completed`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to translate to ${AI_TRANSLATION_CONFIG.LANGUAGES[lang]}:`, error.message);
      errors.push({
        language: lang,
        error: error.message
      });
      
      // Keep original text as fallback
      translations[lang] = {
        title: title,
        content: content
      };
    }
  }
  
  console.log(`🎉 Translation completed for ${Object.keys(translations).length} languages`);
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} translation errors occurred:`, errors);
  }

  return {
    translations,
    errors,
    summary: {
      sourceLanguage,
      targetLanguages,
      successful: targetLanguages.length - errors.length,
      failed: errors.length
    }
  };
}

/**
 * Example usage function
 */
async function exampleUsage() {
  // You need to provide your OpenAI API key
  const OPENAI_API_KEY = 'your-openai-api-key-here';
  
  const khutbahTitle = "The Importance of Teaching Children the Qur'an";
  const khutbahContent = `All praise is due to Allah, who revealed to us the Noble Qur'an, a light and guidance for all the worlds.

We bear witness that there is no deity worthy of worship except Allah, and we bear witness that our Prophet Muhammad is the Messenger of Allah and the Seal of the Prophets.

Allah the Most High said: ﴿الم* ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى ‌لِلْمُتَّقِينَ﴾

"Alif, Lām, Meem. This is the Book about which there is no doubt, a guidance for those conscious of Allah."`;

  try {
    const result = await translateKhutbah(
      khutbahTitle, 
      khutbahContent, 
      'en', 
      OPENAI_API_KEY,
      ['de', 'tr', 'ar'] // Only translate to German, Turkish, and Arabic
    );
    
    console.log('Translation results:', result);
    
    // Generate SQL INSERT statement with translations
    generateSQLWithTranslations(khutbahTitle, khutbahContent, result.translations);
    
  } catch (error) {
    console.error('Translation failed:', error);
  }
}

/**
 * Generates SQL INSERT statement with translations
 */
function generateSQLWithTranslations(originalTitle, originalContent, translations) {
  // Build title translations JSON
  const titleTranslations = { orig: originalTitle };
  Object.keys(translations).forEach(lang => {
    titleTranslations[lang] = translations[lang].title;
  });

  // Build translation map JSON
  const translationMap = translations;

  console.log(`
-- SQL INSERT with AI translations
INSERT INTO lectures (
  id,
  title,
  content,
  type,
  status,
  mosque_id,
  created_by,
  title_translations,
  translation_map,
  num_views,
  created_at
) VALUES (
  uuid_generate_v4(),
  '${originalTitle.replace(/'/g, "''")}',
  '${originalContent.replace(/'/g, "''")}',
  'Khutbah',
  'Public',
  (SELECT id FROM mosques WHERE handle = 'bilal-moschee-bielefeld'),
  (SELECT id FROM users WHERE role IN ('Admin', 'Imam') LIMIT 1),
  '${JSON.stringify(titleTranslations).replace(/'/g, "''")}'::jsonb,
  '${JSON.stringify(translationMap).replace(/'/g, "''")}'::jsonb,
  0,
  NOW()
);
  `);
}

// Export functions for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translateWithAI,
    translateKhutbah,
    AI_TRANSLATION_CONFIG
  };
}

console.log('AI Translation Service loaded. Use translateKhutbah() function to translate your khutbahs.');
