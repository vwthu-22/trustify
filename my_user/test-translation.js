// Test script for translation API
// Run with: node test-translation.js

const testTranslation = async () => {
    try {
        console.log('🧪 Testing Translation API...\n');

        const response = await fetch('http://localhost:3000/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: 'Hello world',
                targetLang: 'vi',
                sourceLang: 'en'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Translation successful!');
            console.log('📝 Original text:', 'Hello world');
            console.log('🌐 Translated text:', data.translatedText);
            console.log('🔧 Engine used:', data.engine);
            console.log('🗣️  Source language:', data.sourceLanguage);
            console.log('🎯 Target language:', data.targetLanguage);
        } else {
            console.log('❌ Translation failed:');
            console.log('Error:', data.error);
            console.log('Message:', data.message);
            console.log('Engine:', data.engine);
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        console.log('\n💡 Make sure the dev server is running: npm run dev');
    }
};

testTranslation();
