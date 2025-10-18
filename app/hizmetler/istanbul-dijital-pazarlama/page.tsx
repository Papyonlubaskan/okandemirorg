import type { Metadata } from "next";
import Link from "next/link";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "İstanbul Dijital Pazarlama Uzmanı | Okan Demir - Web Tasarım & SEO",
  description: "İstanbul'da dijital pazarlama uzmanı Okan Demir. Web tasarım, SEO, Google Ads, e-ticaret platformları (Ticimax, İdeasoft, İkas) hizmetleri. İstanbul merkezli profesyonel çözümler.",
  keywords: ["İstanbul Dijital Pazarlama", "İstanbul Web Tasarım", "İstanbul SEO Uzmanı", "İstanbul E-ticaret", "İstanbul Google Ads", "İstanbul Sosyal Medya", "Okan Demir İstanbul"],
  openGraph: {
    title: "İstanbul Dijital Pazarlama Uzmanı | Okan Demir",
    description: "İstanbul'da profesyonel dijital pazarlama, web tasarım ve e-ticaret hizmetleri. Türkiye'nin ticaret merkezinde uzman çözümler.",
    url: "https://okandemir.org/hizmetler/istanbul-dijital-pazarlama",
  },
};

export default function IstanbulDigitalMarketingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Okan Demir - İstanbul Dijital Pazarlama Uzmanı",
    "description": "İstanbul'da dijital pazarlama, web tasarım ve e-ticaret platform uzmanlığı hizmetleri",
    "url": "https://okandemir.org/hizmetler/istanbul-dijital-pazarlama",
    "telephone": "+90 555 267 77 39",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "İstanbul",
      "addressRegion": "İstanbul",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.0082",
      "longitude": "28.9784"
    },
    "areaServed": {
      "@type": "City",
      "name": "İstanbul"
    },
    "serviceType": "Dijital Pazarlama ve Web Tasarım Hizmetleri",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "İstanbul Dijital Pazarlama Hizmetleri",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Tasarım",
            "description": "İstanbul'da profesyonel web tasarım hizmetleri"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "SEO Optimizasyonu",
            "description": "İstanbul işletmeleri için SEO hizmetleri"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "E-ticaret Platform Uzmanlığı",
            "description": "Ticimax, İdeasoft, İkas uzmanlığı"
          }
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="istanbul-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="py-20">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                İstanbul Dijital Pazarlama Uzmanı
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                  Türkiye&apos;nin ticaret merkezi İstanbul&apos;da dijital pazarlama, web tasarım ve e-ticaret platform uzmanlığı hizmetleri sunuyorum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  İstanbul&apos;dan Hemen İletişime Geç
                </a>
                <Link 
                  href="/hizmetler"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Tüm Hizmetlerim
                </Link>
              </div>
            </div>

            {/* İstanbul İçin Özel Hizmetler */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white text-center mb-12">
                İstanbul İşletmeleri İçin Premium Çözümler
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {/* Web Tasarım */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İstanbul Web Tasarım</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    İstanbul&apos;un rekabetçi pazarında öne çıkacak profesyonel web siteleri tasarlıyorum.
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Şişli, Beşiktaş, Kadıköy odaklı</li>
                    <li>• Kurumsal kimlik tasarımı</li>
                    <li>• Yüksek dönüşüm oranları</li>
                    <li>• Multilingual destek</li>
                  </ul>
                </div>

                {/* SEO Hizmetleri */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İstanbul SEO Uzmanı</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    İstanbul&apos;un yoğun rekabet ortamında Google&apos;da üst sıralarda yer almanızı sağlıyorum.
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• İstanbul anahtar kelime stratejisi</li>
                    <li>• Yerel SEO optimizasyonu</li>
                    <li>• Google My Business yönetimi</li>
                    <li>• Rakip analizi ve stratejisi</li>
                  </ul>
                </div>

                {/* E-ticaret */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İstanbul E-ticaret</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    İstanbul&apos;un büyük ticaret hacmine uygun e-ticaret platformları ve çözümleri.
                  </p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Büyük ölçekli e-ticaret</li>
                    <li>• Çoklu mağaza yönetimi</li>
                    <li>• Ödeme sistemi entegrasyonları</li>
                    <li>• Stok yönetimi sistemleri</li>
                  </ul>
                </div>
              </div>

              {/* İstanbul Bölgeleri */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12 text-white mb-16">
                <h3 className="text-3xl font-black mb-8 text-center">İstanbul&apos;da Hizmet Verdiğim Bölgeler</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <h4 className="text-xl font-black mb-2">Şişli</h4>
                    <p className="text-blue-100 dark:text-gray-300">İş merkezi</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black mb-2">Beşiktaş</h4>
                    <p className="text-blue-100 dark:text-gray-300">Ticari bölge</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black mb-2">Kadıköy</h4>
                    <p className="text-blue-100 dark:text-gray-300">Anadolu yakası</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black mb-2">Beyoğlu</h4>
                    <p className="text-blue-100 dark:text-gray-300">Tarihi merkez</p>
                  </div>
                </div>
              </div>

              {/* İstanbul Avantajları */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
                  İstanbul&apos;da Dijital Pazarlama Uzmanı Olmanın Avantajları
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">🏢 İstanbul&apos;un Gücü</h4>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li>• Türkiye&apos;nin ticaret merkezi</li>
                      <li>• Büyük pazar potansiyeli</li>
                      <li>• Uluslararası bağlantılar</li>
                      <li>• Teknoloji ve inovasyon hub&apos;ı</li>
                      <li>• Finans merkezi</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">💼 İstanbul Deneyimim</h4>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li>• Büyük şirketlerle çalışma</li>
                      <li>• Uluslararası projeler</li>
                      <li>• Karmaşık SEO stratejileri</li>
                      <li>• Rekabetçi pazar analizi</li>
                      <li>• Yüksek bütçeli kampanyalar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
