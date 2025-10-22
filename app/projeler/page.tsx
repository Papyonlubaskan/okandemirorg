import Image from 'next/image'
import Link from 'next/link'
import PortfolioFilter from '@/components/PortfolioFilter'

export default function Projeler() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6">
              <span className="block">Seçilebilir</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Çalışmalarım
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 leading-tight mb-8">
              Tasarım Harikalarıyla Dijital Pazarlama ile Markanızı ve Sizi Yükseltmek!
            </p>
            <Link 
              href="https://wa.me/+905552677739"
              className="inline-flex items-center bg-green-600 hover:bg-green-700  text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
              Randevu Al!
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Filter with Grid */}
      <PortfolioFilter />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-600 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Rakamlarla Başarılarım
            </h2>
            <p className="text-xl text-blue-100">
              Müşterilerimle birlikte elde ettiğimiz sonuçlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">50+</div>
              <div className="text-xl text-blue-100">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">%300</div>
              <div className="text-xl text-blue-100">Ortalama Satış Artışı</div>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">100%</div>
              <div className="text-xl text-blue-100">Müşteri Memnuniyeti</div>
            </div>
            <div className="text-center">
              <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">24/7</div>
              <div className="text-xl text-blue-100">Destek Hizmeti</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Projenizi Hayata Geçirelim!
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Sizin de başarı hikayenizi yazalım. Hemen iletişime geçin!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://wa.me/+905552677739"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700  text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                WhatsApp ile İletişim
              </Link>
              <Link 
                href="/iletisim"
                className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
              >
                <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                E-posta Gönder
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

