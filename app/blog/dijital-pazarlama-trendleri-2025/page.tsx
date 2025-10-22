import type { Metadata } from "next";
import Link from "next/link";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "2025 Dijital Pazarlama Trendleri | Okan Demir Blog",
  description: "2025 yılında dijital pazarlama dünyasında öne çıkacak trendler. AI, video pazarlama, sesli arama ve kişiselleştirme stratejileri hakkında detaylı analiz.",
  keywords: ["2025 Dijital Pazarlama Trendleri", "AI Pazarlama", "Video Pazarlama", "Sesli Arama", "Kişiselleştirme", "Okan Demir Blog"],
  openGraph: {
    title: "2025 Dijital Pazarlama Trendleri | Okan Demir Blog",
    description: "2025 yılında dijital pazarlama dünyasında öne çıkacak trendler ve stratejiler.",
    url: "https://okandemir.org/blog/dijital-pazarlama-trendleri-2025",
    type: "article",
  },
};

export default function DigitalMarketingTrends2025Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "2025 Dijital Pazarlama Trendleri",
    "description": "2025 yılında dijital pazarlama dünyasında öne çıkacak trendler ve stratejiler",
    "image": "https://okandemir.org/blog/dijital-pazarlama-trendleri-2025.jpg",
    "author": {
      "@type": "Person",
      "name": "Okan Demir",
      "url": "https://okandemir.org/hakkimda"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Okan Demir",
      "logo": {
        "@type": "ImageObject",
        "url": "https://okandemir.org/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://okandemir.org/blog/dijital-pazarlama-trendleri-2025"
    }
  };

  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <article className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Ana Sayfa</Link>
                {' > '}
                <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
                {' > '}
                <span className="text-gray-900 dark:text-white font-black">Dijital Pazarlama Trendleri 2025</span>
              </nav>

              {/* Header */}
              <header className="mb-12">
                <div className="mb-6">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-black">
                    Dijital Pazarlama
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  2025 Dijital Pazarlama Trendleri: Geleceği Şekillendiren Teknolojiler
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                  <span>Okan Demir</span>
                  <span>•</span>
                  <span>15 Ocak 2025</span>
                  <span>•</span>
                  <span>8 dk okuma</span>
                </div>
              </header>

              {/* Featured Image */}
              <div className="mb-12">
                <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-black mb-2">2025 Dijital Pazarlama Trendleri</h3>
                    <p className="text-blue-100">Geleceği şekillendiren teknolojiler</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 mb-8">
                  <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    2025 yılına girerken dijital pazarlama dünyası hızla değişiyor. AI teknolojilerinin yaygınlaşması, 
                    tüketici davranışlarının evrimi ve yeni platformların ortaya çıkması, pazarlama stratejilerini köklü 
                    bir şekilde dönüştürüyor. Bu yazıda, 2025&apos;te öne çıkacak en önemli dijital pazarlama trendlerini 
                    detaylı olarak inceliyoruz.
                  </p>
                </div>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-12">
                  1. Yapay Zeka (AI) Destekli Kişiselleştirme
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Yapay zeka teknolojileri artık sadece geleceğin teknolojisi değil, bugünün gerçeği. 2025&apos;te AI, 
                  müşteri deneyimini kişiselleştirmede çok daha sofistike hale gelecek. Makine öğrenmesi algoritmaları, 
                  her kullanıcının davranışını analiz ederek özel içerikler, ürün önerileri ve pazarlama mesajları sunacak.
                </p>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">AI Kişiselleştirme Örnekleri:</h3>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li>• <strong>Dinamik İçerik:</strong> Her kullanıcıya özel web sayfası içerikleri</li>
                    <li>• <strong>Akıllı E-posta Pazarlama:</strong> AI ile optimize edilmiş e-posta kampanyaları</li>
                    <li>• <strong>Kişiselleştirilmiş Ürün Önerileri:</strong> Satın alma geçmişine dayalı öneriler</li>
                    <li>• <strong>Chatbot Optimizasyonu:</strong> Doğal dil işleme ile gelişmiş müşteri hizmetleri</li>
                  </ul>
                </div>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-12">
                  2. Video-First Pazarlama Stratejileri
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Video içerik, 2025&apos;te dijital pazarlamanın kalbi olacak. TikTok, Instagram Reels, YouTube Shorts 
                  gibi platformların popülaritesi artarken, işletmeler de video-first yaklaşımını benimsiyor. 
                  Kısa form video içerikler, canlı yayınlar ve interaktif videolar pazarlama stratejilerinin 
                  merkezinde yer alacak.
                </p>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-12">
                  3. Sesli Arama Optimizasyonu (Voice Search SEO)
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Alexa, Google Assistant ve Siri gibi sesli asistanların kullanımı her geçen gün artıyor. 
                  2025&apos;te sesli arama optimizasyonu, SEO stratejilerinin ayrılmaz bir parçası olacak. 
                  Konuşma diline uygun içerik üretimi ve yerel sesli arama optimizasyonu kritik hale gelecek.
                </p>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-12">
                  4. Sürdürülebilirlik ve Etik Pazarlama
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Tüketiciler artık sadece ürün kalitesine değil, şirketlerin değerlerine de bakıyor. 
                  2025&apos;te sürdürülebilirlik, çevresel sorumluluk ve etik değerler pazarlama mesajlarının 
                  merkezinde yer alacak. Green marketing ve purpose-driven branding önem kazanacak.
                </p>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-12">
                  5. Metaverse ve Sanal Gerçeklik Pazarlama
                </h2>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  Metaverse kavramı hızla gelişiyor ve                   2025&apos;te daha fazla işletme sanal dünyalarda 
                  pazarlama aktiviteleri gerçekleştirecek. VR deneyimleri, sanal mağazalar ve 
                  immersive reklamlar yeni pazarlama kanalları olarak öne çıkacak.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 mt-12">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    Sonuç: Geleceğe Hazır Olmak
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    2025 dijital pazarlama trendleri, işletmelerin müşteri deneyimini öncelemesi ve 
                    teknoloji ile insan dokunuşunu dengelemesi gerektiğini gösteriyor. Bu trendlere 
                    erken adapte olan işletmeler, rekabet avantajı elde edecek ve müşteri sadakatini artıracak.
                  </p>
                </div>
              </div>

              {/* Author Bio */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mt-12 shadow-lg">
                <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-white font-black text-lg">OD</span>
                </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Okan Demir</h3>
                    <p className="text-gray-600 dark:text-gray-400">Dijital Pazarlama Uzmanı</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  5+ yıllık deneyimle dijital pazarlama, web tasarım ve e-ticaret alanlarında uzman. 
                  İzmir merkezli olarak Türkiye genelinde hizmet veriyor.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://wa.me/+905552677739"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700  text-white px-6 py-3 rounded-full font-black transition-colors"
                  >
                    WhatsApp
                  </a>
                  <Link 
                    href="/hizmetler"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700  text-white px-6 py-3 rounded-full font-black transition-colors"
                  >
                    Hizmetlerim
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">İlgili Yazılar</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/blog/seo-optimizasyonu-2025" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">2025 SEO Optimizasyonu Rehberi</h4>
                    <p className="text-gray-600 dark:text-gray-400">Yeni SEO trendleri ve stratejileri</p>
                  </Link>
                  <Link href="/blog/e-ticaret-platform-secimi" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2">E-ticaret Platform Seçimi</h4>
                    <p className="text-gray-600 dark:text-gray-400">Ticimax, İdeasoft, İkas karşılaştırması</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
