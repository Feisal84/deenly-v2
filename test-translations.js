// Test translation keys in browser console
// Open browser developer tools (F12) and paste this code to test translations

console.log('Testing translation keys...');

// Try to access the translation function (if available in browser)
if (typeof window !== 'undefined' && window.location) {
  console.log('Current URL:', window.location.href);
  
  // Check if next-intl is available
  try {
    // This will help identify if translations are loading
    const translationElements = document.querySelectorAll('[data-testid*="translation"], [title*="Dashboard"], [title*="Lecture"]');
    console.log('Found translation elements:', translationElements.length);
    
    // Check for error messages in console
    const errors = [];
    const originalError = console.error;
    console.error = function(...args) {
      if (args.join(' ').includes('MISSING_MESSAGE')) {
        errors.push(args.join(' '));
      }
      originalError.apply(console, args);
    };
    
    setTimeout(() => {
      console.log('Translation errors found:', errors);
      console.error = originalError;
    }, 2000);
    
  } catch (e) {
    console.log('Translation test error:', e.message);
  }
}

console.log('Translation test completed. Check the results above.');
