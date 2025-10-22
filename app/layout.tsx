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
  title: "Okan Demir - Dijital Pazarlama Uzmanı | Web Tasarım & E-ticaret",
  description: "Okan Demir - Türkiye'nin önde gelen dijital pazarlama uzmanı. Web tasarım, SEO, Google Ads, Meta Business, e-ticaret platformları (Ticimax, İdeasoft, İkas). 5+ yıl deneyim, 50+ proje, %98 müşteri memnuniyeti.",
  keywords: ["Okan Demir", "Okan", "Dijital Pazarlama", "Web Tasarım", "SEO", "Google Ads", "Meta Business", "E-ticaret", "Ticimax", "İdeasoft", "İkas", "Freelancer", "Dijital Dönüşüm"],
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
    url: 'https://okandemir.org',
    title: 'Okan Demir - Dijital Pazarlama Uzmanı | Web Tasarım & E-ticaret',
    description: 'Okan Demir - Türkiye\'nin önde gelen dijital pazarlama uzmanı. Web tasarım, SEO, Google Ads, Meta Business, e-ticaret platformları.',
    siteName: 'Okan Demir',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Okan Demir - Dijital Pazarlama Uzmanı | Web Tasarım & E-ticaret',
    description: 'Okan Demir - Türkiye\'nin önde gelen dijital pazarlama uzmanı. Web tasarım, SEO, Google Ads, Meta Business, e-ticaret platformları.',
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
