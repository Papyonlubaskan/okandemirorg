import type { Metadata } from "next";
import Link from "next/link";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Ticimax E-ticaret Başarı Hikayesi | Okan Demir Case Study",
  description: "Ticimax platformunda kurduğumuz e-ticaret sitesinin %300 satış artışı hikayesi. Kurulum, tasarım, SEO ve pazarlama stratejilerinin detaylı analizi.",
  keywords: ["Ticimax Case Study", "E-ticaret Başarı Hikayesi", "Ticimax SEO", "E-ticaret Optimizasyonu", "Okan Demir Projeler"],
  openGraph: {
    title: "Ticimax E-ticaret Başarı Hikayesi | Okan Demir",
    description: "Ticimax platformunda %300 satış artışı elde eden e-ticaret projesi detayları.",
    url: "https://okandemir.org/case-studies/ticimax-e-ticaret-basarisi",
    type: "article",
  },
};

export default function TicimaxCaseStudyPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    "headline": "Ticimax E-ticaret Başarı Hikayesi: %300 Satış Artışı",
    "description": "Ticimax platformunda kurduğumuz e-ticaret sitesinin başarı hikayesi",
    "image": "https://okandemir.org/case-studies/ticimax-success.jpg",
    "author": {
      "@type": "Person",
      "name": "Okan Demir",
      "url": "https://okandemir.org/hakkimda"
    },
    "datePublished": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://okandemir.org/case-studies/ticimax-e-ticaret-basarisi"
    },
    "about": {
      "@type": "Product",
      "name": "Ticimax E-ticaret Platformu"
    }
  };

  return (
    <>
      <Script
        id="case-study-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Ana Sayfa</Link>
                {' > '}
                <Link href="/projeler" className="hover:text-blue-600 dark:hover:text-blue-400">Projeler</Link>
                {' > '}
                <span className="text-gray-900 dark:text-white font-black">Ticimax E-ticaret Başarı Hikayesi</span>
              </nav>

              {/* Header */}
              <header className="text-center mb-16">
                <div className="mb-6">
                  <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-black">
                    Case Study
                  </span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  Ticimax E-ticaret Başarı Hikayesi
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                  %300 Satış Artışı ile Dönüştürülen E-ticaret Platformu
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-gray-600 dark:text-gray-400">
                  <span>• Ticimax Platformu</span>
                  <span>• 6 Ay Süre</span>
                  <span>• %300 Büyüme</span>
                  <span>• E-ticaret Uzmanlığı</span>
                </div>
              </header>

              {/* Success Metrics */}
              <div className="grid md:grid-cols-4 gap-6 mb-16">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black mb-2">%300</div>
                  <div className="text-green-100">Satış Artışı</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black mb-2">6 Ay</div>
                  <div className="text-blue-100">Proje Süresi</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black mb-2">%85</div>
                  <div className="text-purple-100">Dönüşüm Oranı</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black mb-2">24/7</div>
                  <div className="text-orange-100">Destek</div>
                </div>
              </div>

              {/* Project Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Proje Özeti</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Müşteri Profili</h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li>• <strong>Sektör:</strong> Moda ve Tekstil</li>
                      <li>• <strong>Lokasyon:</strong> İzmir</li>
                      <li>• <strong>Hedef Kitle:</strong> 25-45 yaş arası kadınlar</li>
                      <li>• <strong>Ürün Sayısı:</strong> 500+ ürün</li>
                      <li>• <strong>Yıllık Ciro:</strong> 2M TL (proje öncesi)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">Proje Hedefleri</h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li>• Satış hacmini 2 katına çıkarma</li>
                      <li>• Kullanıcı deneyimini iyileştirme</li>
                      <li>• SEO performansını artırma</li>
                      <li>• Mobil uyumluluğu sağlama</li>
                      <li>• Ödeme süreçlerini optimize etme</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Challenges */}
              <div className="mb-16">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Karşılaşılan Zorluklar</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Eski Sistem Sorunları</h3>
                    <p className="text-gray-700 dark:text-gray-300">Yavaş yüklenen sayfalar, kötü kullanıcı deneyimi ve düşük dönüşüm oranları</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">SEO Eksiklikleri</h3>
                    <p className="text-gray-700 dark:text-gray-300">Google&apos;da görünürlük sorunları ve organik trafik kaybı</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Mobil Uyumsuzluk</h3>
                    <p className="text-gray-700 dark:text-gray-300">Mobil kullanıcılar için kötü deneyim ve yüksek çıkış oranları</p>
                  </div>
                </div>
              </div>

              {/* Solutions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Uygulanan Çözümler</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Ticimax Platform Kurulumu</h3>
                      <p className="text-gray-700 dark:text-gray-300">Modern Ticimax altyapısı ile hızlı ve güvenli e-ticaret platformu</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Responsive Tasarım</h3>
                      <p className="text-gray-700 dark:text-gray-300">Tüm cihazlarda mükemmel görünüm ve kullanıcı deneyimi</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">SEO Optimizasyonu</h3>
                      <p className="text-gray-700 dark:text-gray-300">Teknik SEO, içerik optimizasyonu ve yerel SEO stratejileri</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="border-l-4 border-orange-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Ödeme Sistemi Entegrasyonu</h3>
                      <p className="text-gray-700 dark:text-gray-300">Güvenli ödeme çözümleri ve kargo entegrasyonları</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Performans Optimizasyonu</h3>
                      <p className="text-gray-700 dark:text-gray-300">Hızlı yüklenen sayfalar ve optimize edilmiş görsel yönetimi</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-6">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Analytics ve Raporlama</h3>
                      <p className="text-gray-700 dark:text-gray-300">Detaylı performans analizi ve satış raporlama sistemi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12 text-white mb-16">
                <h2 className="text-3xl font-black mb-8 text-center">Elde Edilen Sonuçlar</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">%300</div>
                    <div className="text-green-100 dark:text-gray-300">Satış Artışı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">%250</div>
                    <div className="text-blue-100 dark:text-gray-300">Organik Trafik Artışı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">%85</div>
                    <div className="text-purple-100 dark:text-gray-300">Dönüşüm Oranı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">2.5s</div>
                    <div className="text-orange-100 dark:text-gray-300">Sayfa Yükleme Süresi</div>
                  </div>
                </div>
              </div>

              {/* Client Testimonial */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6 font-medium italic">
                    &ldquo;Okan Demir ile çalışmak işimizi tamamen dönüştürdü. Ticimax platformunda kurduğu e-ticaret sitemiz 
                    sayesinde satışlarımız %300 arttı. Profesyonel yaklaşımı ve teknik uzmanlığı gerçekten etkileyici.&rdquo;
                  </blockquote>
                  <div className="text-gray-600 dark:text-gray-400">
                    <div className="font-black text-lg">Ayşe Yılmaz</div>
                    <div>CEO, Moda Dünyası</div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                  Sizin de E-ticaret Başarı Hikayenizi Yazalım
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  Ticimax, İdeasoft veya İkas platformlarında profesyonel e-ticaret çözümleri için benimle iletişime geçin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/+905552677739"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700  text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp ile İletişim
                  </a>
                  <Link 
                    href="/hizmetler/e-ticaret-platformlari"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700  text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    E-ticaret Hizmetleri
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
