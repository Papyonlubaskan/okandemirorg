import type { Metadata } from "next";
import Link from "next/link";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Müşteri Yorumları ve Referanslar | Okan Demir",
  description: "Okan Demir ile çalışan müşterilerin gerçek yorumları ve başarı hikayeleri. Dijital pazarlama, web tasarım ve e-ticaret projelerimizin sonuçları.",
  keywords: ["Okan Demir Müşteri Yorumları", "Dijital Pazarlama Referanslar", "Web Tasarım Başarı Hikayeleri", "E-ticaret Müşteri Yorumları", "Okan Demir Referanslar"],
  openGraph: {
    title: "Müşteri Yorumları ve Referanslar | Okan Demir",
    description: "Gerçek müşteri yorumları ve başarı hikayeleri ile Okan Demir'in profesyonel hizmetleri.",
    url: "https://okandemir.org/referanslar",
  },
};

export default function ReferanslarPage() {
  const testimonials = [
    {
      name: "Ayşe Yılmaz",
      company: "Moda Dünyası",
      position: "CEO",
      image: "/testimonials/ayse-yilmaz.jpg",
      rating: 5,
      text: "Okan Demir ile çalışmak işimizi tamamen dönüştürdü. Ticimax platformunda kurduğu e-ticaret sitemiz sayesinde satışlarımız %300 arttı. Profesyonel yaklaşımı ve teknik uzmanlığı gerçekten etkileyici.",
      project: "E-ticaret Platform Kurulumu",
      results: "Satışlarda %300 artış, organik trafikte %250 büyüme"
    },
    {
      name: "Mehmet Kaya",
      company: "Teknoloji Çözümleri",
      position: "Genel Müdür",
      image: "/testimonials/mehmet-kaya.jpg",
      rating: 5,
      text: "Web sitemizi yenilemek için Okan'ı yardım aldık. Modern tasarım, hızlı yüklenme ve SEO optimizasyonu sayesinde Google'da ilk sayfaya çıktık. Müşteri hizmetleri de mükemmel.",
      project: "Web Tasarım ve SEO",
      results: "Google'da ilk sayfa, %180 organik trafik artışı"
    },
    {
      name: "Fatma Demir",
      company: "Güzellik Merkezi",
      position: "Sahibi",
      image: "/testimonials/fatma-demir.jpg",
      rating: 5,
      text: "Sosyal medya hesaplarımızı yönetmek ve dijital pazarlama stratejilerimizi geliştirmek için Okan'dan destek aldık. Instagram takipçilerimiz 5 kat arttı ve randevu sayılarımız %200 yükseldi.",
      project: "Sosyal Medya Yönetimi",
      results: "Instagram takipçilerinde %500 artış, randevularda %200 büyüme"
    },
    {
      name: "Ali Özkan",
      company: "Restoran Zinciri",
      position: "Operasyon Müdürü",
      image: "/testimonials/ali-ozkan.jpg",
      rating: 5,
      text: "Google Ads kampanyalarımızı Okan yönetiyor. Reklam maliyetlerimizi %40 düşürürken, sipariş sayılarımızı %150 artırdık. ROI oranımız mükemmel seviyede.",
      project: "Google Ads Yönetimi",
      results: "Maliyetlerde %40 azalma, siparişlerde %150 artış"
    },
    {
      name: "Zeynep Aktaş",
      company: "Eğitim Merkezi",
      position: "Kurucu",
      image: "/testimonials/zeynep-aktas.jpg",
      rating: 5,
      text: "Online kurs platformumuzu kurmak için Okan'ın uzmanlığına başvurduk. İdeasoft platformunda harika bir eğitim sitesi oluşturduk. Öğrenci kayıtlarımız %400 arttı.",
      project: "Eğitim Platformu Kurulumu",
      results: "Öğrenci kayıtlarında %400 artış, platform kullanımında %250 büyüme"
    },
    {
      name: "Can Yıldız",
      company: "İnşaat Firması",
      position: "Pazarlama Müdürü",
      image: "/testimonials/can-yildiz.jpg",
      rating: 5,
      text: "İnşaat projelerimizi tanıtmak için profesyonel bir web sitesi ve dijital pazarlama stratejisi istiyorduk. Okan, hem teknik hem de pazarlama konularında mükemmel çözümler sundu.",
      project: "Kurumsal Web Sitesi",
      results: "Web trafiğinde %300 artış, potansiyel müşteri sayısında %250 büyüme"
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Okan Demir - Dijital Pazarlama Uzmanı",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": testimonials.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map(testimonial => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": testimonial.text,
      "datePublished": "2025-01-15"
    }))
  };

  return (
    <>
      <Script
        id="testimonials-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <header className="text-center mb-16">
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                  Müşteri Yorumları ve Referanslar
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                  Gerçek müşteri deneyimleri ve başarı hikayeleri
                </p>
                
                {/* Overall Rating */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg inline-block">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-6xl font-black text-yellow-500">5.0</div>
                    <div className="ml-4">
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonials.length} müşteri yorumu
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Testimonials Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                      &ldquo;{testimonial.text}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-black text-lg">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.position}</div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">{testimonial.company}</div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <strong>Proje:</strong> {testimonial.project}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        <strong>Sonuç:</strong> {testimonial.results}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success Statistics */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12 text-white mb-16">
                <h2 className="text-3xl font-black mb-8 text-center">Müşteri Memnuniyeti İstatistikleri</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">%98</div>
                    <div className="text-blue-100 dark:text-gray-300">Müşteri Memnuniyeti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">50+</div>
                    <div className="text-purple-100 dark:text-gray-300">Tamamlanan Proje</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">%85</div>
                    <div className="text-green-100 dark:text-gray-300">Tekrar Çalışma Oranı</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">24/7</div>
                    <div className="text-orange-100 dark:text-gray-300">Destek Hizmeti</div>
                  </div>
                </div>
              </div>

              {/* Process */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
                  Çalışma Sürecimiz
                </h2>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-black text-xl">1</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">İlk Görüşme</h3>
                    <p className="text-gray-600 dark:text-gray-400">İhtiyaçlarınızı analiz ediyoruz</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-black text-xl">2</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Strateji Geliştirme</h3>
                    <p className="text-gray-600 dark:text-gray-400">Özel çözümler tasarlıyoruz</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-black text-xl">3</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Uygulama</h3>
                    <p className="text-gray-600 dark:text-gray-400">Projelerinizi hayata geçiriyoruz</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-black text-xl">4</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Destek</h3>
                    <p className="text-gray-600 dark:text-gray-400">Sürekli destek sağlıyoruz</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                  Siz de Başarı Hikayenizi Yazın
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  Profesyonel dijital pazarlama, web tasarım ve e-ticaret hizmetleri ile işinizi büyütün.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/+905552677739"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp ile İletişim
                  </a>
                  <Link 
                    href="/hizmetler"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Hizmetlerimi İncele
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
