import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Loading from "@/components/Loading";
import StructuredData from "./structured-data";
import WhatsAppChatbot from "@/components/WhatsAppChatbot";
import AccessibilityHelper from "@/components/AccessibilityHelper";
import ConsoleErrorSuppressor from "@/components/ConsoleErrorSuppressor";

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  display: "swap",
  variable: '--font-montserrat',
  preload: true,
});

export const metadata: Metadata = {
  title: "O Copyright© Dijital Pazarlama & Yazılım | Okan Demir",
  description: "Okan Demir - Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi. Profesyonel dijital çözümlerle işinizi büyütün. 5+ yıl deneyim, 50+ proje, %98 müşteri memnuniyeti.",
  keywords: ["Okan Demir", "Dijital Pazarlama", "Web Tasarım", "SEO", "Google Ads", "Meta Business", "Sosyal Medya", "Freelancer", "Dijital Dönüşüm"],
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
    title: 'O Copyright© Dijital Pazarlama & Yazılım | Okan Demir',
    description: 'Okan Demir - Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi.',
    siteName: 'Okan Demir',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Copyright© Dijital Pazarlama & Yazılım | Okan Demir',
    description: 'Okan Demir - Dijital Pazarlama Uzmanı, Web Tasarım, SEO, Google Ads, Meta Business, Sosyal Medya Yönetimi.',
  },
  verification: {
    google: 'google-site-verification-code',
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
      <body className={`${montserrat.variable} antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <ConsoleErrorSuppressor />
        <AccessibilityHelper />
        <StructuredData />
        <WhatsAppChatbot />
        <Loading />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
