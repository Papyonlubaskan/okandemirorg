// Google Analytics GA4 Configuration
// Bu dosya Google Analytics GA4 tracking için kullanılır

// GA4 Measurement ID'nizi buraya ekleyin
// Google Analytics > Admin > Data Streams > Web > Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Google Analytics gtag konfigürasyonu
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);

// Custom event tracking fonksiyonları
function trackEvent(eventName, eventParameters = {}) {
  gtag('event', eventName, eventParameters);
}

function trackPageView(url) {
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trackEvent, trackPageView };
}
