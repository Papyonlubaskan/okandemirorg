import type { Metadata } from "next";
// import Link from "next/link"; // Kullanılmıyor

export const metadata: Metadata = {
  title: "Sosyal Medya Hesaplarım | Okan Demir - Dijital Pazarlama Uzmanı",
  description: "Okan Demir'in tüm sosyal medya hesapları ve dijital pazarlama içerikleri. Instagram, YouTube, LinkedIn, Twitter ve Facebook'ta beni takip edin.",
  keywords: ["Okan Demir Instagram", "Okan Demir YouTube", "Okan Demir LinkedIn", "Okan Demir Twitter", "Okan Demir Facebook", "Dijital Pazarlama İçerikleri"],
  openGraph: {
    title: "Sosyal Medya Hesaplarım | Okan Demir",
    description: "Dijital pazarlama uzmanı Okan Demir&apos;in tüm sosyal medya hesapları ve içerikleri.",
    url: "https://okandemir.org/sosyal-medya",
  },
};

export default function SosyalMedyaPage() {
  const socialPlatforms = [
    {
      name: "Instagram",
      handle: "@okandemirorg",
      url: "https://www.instagram.com/okandemirorg",
      description: "Dijital pazarlama ipuçları, proje paylaşımları ve günlük içerikler",
      icon: "📸",
      color: "from-pink-500 to-purple-600",
      followers: "2.5K+"
    },
    {
      name: "YouTube",
      handle: "@PapyonluBaskan",
      url: "https://www.youtube.com/@PapyonluBaskan",
      description: "Dijital pazarlama eğitimleri, case study'ler ve teknoloji incelemeleri",
      icon: "🎥",
      color: "from-red-500 to-red-600",
      followers: "1.2K+"
    },
    {
      name: "LinkedIn",
      handle: "Okan Demir",
      url: "https://www.linkedin.com/in/okan-demir",
      description: "Profesyonel ağ, iş deneyimleri ve sektörel içerikler",
      icon: "💼",
      color: "from-blue-600 to-blue-700",
      followers: "850+"
    },
    {
      name: "Twitter",
      handle: "@okandemirorg",
      url: "https://twitter.com/okandemirorg",
      description: "Güncel teknoloji haberleri ve dijital pazarlama tartışmaları",
      icon: "🐦",
      color: "from-blue-400 to-blue-500",
      followers: "650+"
    },
    {
      name: "Facebook",
      handle: "Okan Demir",
      url: "https://www.facebook.com/okandemirorg",
      description: "Topluluk paylaşımları ve müşteri etkileşimleri",
      icon: "👥",
      color: "from-blue-600 to-indigo-600",
      followers: "1.8K+"
    },
    {
      name: "WhatsApp",
      handle: "+90 555 267 77 39",
      url: "https://wa.me/+905552677739",
      description: "Hızlı iletişim ve proje danışmanlığı",
      icon: "💬",
      color: "from-green-500 to-green-600",
      followers: "Direkt İletişim"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                Sosyal Medya Hesaplarım
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                Dijital pazarlama dünyasından güncel içerikler, proje paylaşımları ve uzmanlık deneyimlerim
              </p>
            </header>

            {/* Social Platforms Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {socialPlatforms.map((platform, index) => (
                <a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{platform.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    {platform.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    {platform.handle}
                  </p>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {platform.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {platform.followers}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Content Strategy */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
                İçerik Stratejim
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Eğitim İçerikleri</h3>
                  <p className="text-gray-600 dark:text-gray-400">Dijital pazarlama ipuçları ve rehberler</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Proje Paylaşımları</h3>
                  <p className="text-gray-600 dark:text-gray-400">Tamamlanan projeler ve başarı hikayeleri</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="caption: 0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Güncel Trendler</h3>
                  <p className="text-gray-600 dark:text-gray-400">Teknoloji ve pazarlama trendleri</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Topluluk Etkileşimi</h3>
                  <p className="text-gray-600 dark:text-gray-400">Soru-cevap ve tartışmalar</p>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12 text-white mb-16">
              <h2 className="text-3xl font-black mb-8 text-center">Sosyal Medya İstatistikleri</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">6.9K+</div>
                  <div className="text-blue-100 dark:text-gray-300">Toplam Takipçi</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">%8.5</div>
                  <div className="text-purple-100 dark:text-gray-300">Ortalama Etkileşim</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">500+</div>
                  <div className="text-green-100 dark:text-gray-300">Aylık İçerik</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black mb-2">24/7</div>
                  <div className="text-orange-100 dark:text-gray-300">Aktif İletişim</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                Beni Takip Edin, Güncel Kalın
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Dijital pazarlama dünyasından güncel içerikler ve uzmanlık deneyimlerimi sosyal medya hesaplarımdan takip edebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.instagram.com/okandemirorg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram&apos;da Takip Et
                </a>
                <a 
                  href="https://www.youtube.com/@PapyonluBaskan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube&apos;da Abone Ol
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
