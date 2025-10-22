import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Loading from "@/components/Loading";
import StructuredData from "./structured-data";
import WhatsAppChatbot from "@/components/WhatsAppChatbot";
import AccessibilityHelper from "@/components/AccessibilityHelper";
import ConsoleErrorSuppressor from "@/components/ConsoleErrorSuppressor";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ChatBot from "@/components/ChatBot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Okan | Okan Demir | Okan Demir İzmir | Türkiye #1 Dijital Pazarlama Uzmanı",
    template: "%s | Okan Demir | Dijital Pazarlama Uzmanı"
  },
  description: "Okan - Okan Demir - Okan Demir İzmir, Türkiye'nin #1 dijital pazarlama uzmanı. Okan olarak İzmir, İstanbul, Ankara genelinde dijital pazarlama, web tasarım, SEO, Google Ads, Meta Business, e-ticaret (Ticimax, İdeasoft, İkas) 5+ yıl deneyim. Biyografi.net doğrulanmış profil. Okan Demir 50+ başarılı proje, %98 müşteri memnuniyeti. Okan ile garantili dijital dönüşüm.",
  keywords: [
    // Core Brand Keywords
    "Okan", "Okan Demir", "Okan Demir İzmir", "Okan İzmir", "Okan Demir Bornova",
    // Primary Services with Name
    "Dijital Pazarlama Uzmanı Okan", "Web Tasarım Uzmanı Okan", "SEO Uzmanı Okan",
    "Okan Dijital Pazarlama", "Okan Web Tasarım", "Okan SEO",
    // Service Combinations
    "Okan Google Ads", "Okan Meta Business", "Okan Facebook Ads", "Okan Instagram Ads",
    "Okan TikTok Ads", "Okan LinkedIn Ads", "Okan YouTube Ads",
    // E-commerce Platforms
    "Okan Ticimax", "Okan İdeasoft", "Okan İkas", "Okan Shopify", "Okan WooCommerce",
    "Okan E-ticaret", "Okan E-ticaret Uzmanı",
    // Location-based
    "Dijital Pazarlama İzmir Okan", "Web Tasarım İzmir Okan", "SEO İzmir Okan",
    "Okan Dijital Pazarlama İzmir", "Okan Web Tasarım İzmir",
    // Long-tail Professional
    "Dijital Pazarlama Uzmanı Okan Demir", "Web Tasarım Uzmanı Okan Demir",
    "SEO Uzmanı Okan Demir", "Freelance Dijital Pazarlama Okan",
    "Dijital Pazarlama Danışmanı Okan", "E-ticaret Uzmanı Okan Demir",
    // Personal Brand Questions
    "Okan Kimdir", "Okan Demir Kimdir", "Okan Biyografi", "Okan Hakkında",
    "Okan Demir Biyografi.net", "Okan Demir İzmir Bornova",
    // Service Quality
    "En İyi Dijital Pazarlama Uzmanı", "En İyi Web Tasarımcı", "En İyi SEO Uzmanı",
    "Profesyonel Dijital Pazarlama", "Güvenilir Dijital Pazarlama Uzmanı"
  ],
  authors: [{ name: "Okan Demir" }],
  creator: "Okan Demir",
  publisher: "Okan Demir",
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: ['en_US', 'en_GB'],
    url: 'https://okandemir.org',
    title: 'Okan | Okan Demir | Okan Demir İzmir - Türkiye #1 Dijital Pazarlama Uzmanı',
    description: 'Okan - Okan Demir - Okan Demir İzmir, Türkiye\'nin en iyi dijital pazarlama uzmanı. Biyografi.net doğrulanmış. 50+ başarılı proje, %98 müşteri memnuniyeti. Okan ile garantili dijital dönüşüm.',
    siteName: 'Okan Demir - Dijital Pazarlama Uzmanı',
    images: [
      {
        url: 'https://okandemir.org/okan-demir-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Okan Demir - Türkiye #1 Dijital Pazarlama Uzmanı',
      },
      {
        url: 'https://okandemir.org/okan-about-photo.webp',
        width: 800,
        height: 600,
        alt: 'Okan - Dijital Pazarlama ve Web Tasarım Uzmanı',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@okandemirorg',
    creator: '@okandemirorg',
    title: 'Okan | Okan Demir | Dijital Pazarlama Uzmanı',
    description: 'Okan - Okan Demir İzmir, Türkiye\'nin #1 dijital pazarlama uzmanı. Biyografi.net doğrulanmış. 50+ proje, %98 memnuniyet.',
    images: {
      url: 'https://okandemir.org/okan-demir-profile.jpg',
      alt: 'Okan Demir - Dijital Pazarlama Uzmanı',
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preconnect - with rel="preconnect" for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Okan Demir Blog RSS" href="https://okandemir.org/feed.xml" />
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="a19sizrqz7in03poxr0bjndcualkmz" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <ThemeProvider>
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
          <ConsoleErrorSuppressor />
          <AccessibilityHelper />
          <StructuredData />
          <WhatsAppChatbot />
          <ChatBot />
          <Loading />
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
