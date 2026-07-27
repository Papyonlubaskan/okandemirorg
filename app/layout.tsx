import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import AnalyticsRouteTracker from "@/components/AnalyticsRouteTracker";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Loading from "@/components/Loading";
import StructuredData from "./structured-data";
import DeferredWidgets from "@/components/DeferredWidgets";
import AccessibilityHelper from "@/components/AccessibilityHelper";
import ConsoleErrorSuppressor from "@/components/ConsoleErrorSuppressor";
import { ThemeProvider } from "@/contexts/ThemeContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://okandemir.org"),
  title: {
    default: "Okan Demir | Dijital Pazarlama Uzmanı — İzmir",
    template: "%s | Okan Demir"
  },
  description: "Okan Demir — İzmir merkezli dijital pazarlama uzmanı. Web tasarım, SEO, Google Ads, Meta Ads ve e-ticaret (Ticimax, İkas). 5+ yıl deneyim, 50+ proje. Resmi site: okandemir.org",
  keywords: [
    "Okan", "Okan Demir", "Okan Demir İzmir", "Okan İzmir", "Okan Demir Bornova",
    "Okan Demir kimdir", "Okan Demir hakkında", "Okan Demir biyografi",
    "Okan Demir dijital pazarlama uzmanı",
    "Dijital Pazarlama Uzmanı Okan", "Web Tasarım Uzmanı Okan", "SEO Uzmanı Okan",
    "Okan Dijital Pazarlama", "Okan Web Tasarım", "Okan SEO",
    "Okan Google Ads", "Okan Meta Business", "Okan Facebook Ads", "Okan Instagram Ads",
    "Okan TikTok Ads", "Okan LinkedIn Ads", "Okan YouTube Ads",
    "Okan Ticimax", "Okan İdeasoft", "Okan İkas", "Okan Shopify", "Okan WooCommerce",
    "Okan E-ticaret", "Okan E-ticaret Uzmanı",
    "Dijital Pazarlama İzmir Okan", "Web Tasarım İzmir Okan", "SEO İzmir Okan",
    "Dijital Pazarlama Uzmanı Okan Demir", "Web Tasarım Uzmanı Okan Demir",
    "SEO Uzmanı Okan Demir", "Freelance Dijital Pazarlama Okan",
    "Dijital Pazarlama Danışmanı Okan", "E-ticaret Uzmanı Okan Demir",
    "Okan Kimdir", "Okan Demir Kimdir", "Okan Biyografi", "Okan Hakkında",
    "Okan Demir Biyografi.net", "Okan Demir İzmir Bornova", "Okan Demir ne iş yapar",
    "Okan Demir iletişim", "Okan Demir telefon", "Okan Demir WhatsApp", "Okan Demir e-posta",
    "Profesyonel Dijital Pazarlama", "Dijital Pazarlama Uzmanı İzmir"
  ],
  authors: [{ name: "Okan Demir", url: "https://okandemir.org/hakkimda" }],
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
    title: 'Okan Demir | Dijital Pazarlama Uzmanı — İzmir',
    description: 'Okan Demir resmi web sitesi. Dijital pazarlama, web tasarım, SEO ve e-ticaret hizmetleri.',
    siteName: 'Okan Demir - Dijital Pazarlama Uzmanı',
    images: [
      {
        url: 'https://okandemir.org/okan-demir-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Okan Demir — Dijital Pazarlama Uzmanı',
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
    description: 'Okan Demir — İzmir merkezli dijital pazarlama uzmanı. Resmi site: okandemir.org',
    images: {
      url: 'https://okandemir.org/okan-demir-profile.jpg',
      alt: 'Okan Demir - Dijital Pazarlama Uzmanı',
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
        other: { 'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION },
      }
    : {}),
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
        {/* DNS Prefetch (Google Fonts: next/font Inter handles preconnect) */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Okan Demir Blog RSS" href="https://okandemir.org/feed.xml" />
        
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="a19sizrqz7in03poxr0bjndcualkmz" />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <ThemeProvider>
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || ''} />
          <Suspense fallback={null}>
            <AnalyticsRouteTracker />
          </Suspense>
          <ConsoleErrorSuppressor />
          <AccessibilityHelper />
          <StructuredData />
          <DeferredWidgets />
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
