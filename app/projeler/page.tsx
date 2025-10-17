import Image from 'next/image'
import Link from 'next/link'
import Portfolio3D from '@/components/Portfolio3D'

export default function Projeler() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white">
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
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
              Randevu Al!
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Portfolio Gallery */}
      <Portfolio3D />

      {/* Portfolio Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Portfolio Item 1 */}
            <Link href="/hizmetler/dijital-pazarlama" className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out group hover:transform hover:scale-105 cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Image src="/digital-marketing-icon.png" alt="Dijital Pazarlama" width={80} height={80} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Image src="/digital-marketing-icon.png" alt="Digital Marketing" width={32} height={32} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-6 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-blue-50 transition-all duration-500">
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Dijital Pazarlama</h3>
                  <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Siz ve İşletmeniz İçin Öncü Olma Zamanı Meta Ads & Google Ads & Tiktok & LinkedIn platformlarında sürdürülebilir stratejiler ile mükemmel sonuçları almanızı sağlıyorum! Aylık ve Yıllık Ödeme planları ile İndirimli avantajlar sizleri bekliyor!
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Portfolio Item 2 */}
            <Link href="/hizmetler/wordpress-tasarim" className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Image src="/web-design-icon.png" alt="WordPress Web Tasarımı" width={80} height={80} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <Image src="/wordpress-icon.png" alt="WordPress" width={32} height={32} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">WordPress Web Tasarımı</h3>
                  <p className="text-lg font-black text-gray-600">
                    Siz ve Markanız İçin İster Kişisel, İsterseniz E-Ticaret Web Tasarım Çözümleri ile Yanınızdayım! Daha Kapsamlı E-ticaret kreatifleri için ise İkas, Ticimax, Digi gibi kendi alanlarında lider markalar ile çalışmanızı sağlıyorum.
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Portfolio Item 3 */}
            <Link href="/hizmetler/dijital-donusum" className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Image src="/digital-transformation-icon.png" alt="Dijital Dönüşüm" width={80} height={80} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <Image src="/digital-transformation-icon.png" alt="Digital Transformation" width={32} height={32} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Dijital Dönüşüm ve Süreklilik!</h3>
                  <p className="text-lg font-black text-gray-600">
                    Dijital dönüşüm çağında sürdürülebilir stratejiler ile daima sizin için en uygun seçenekleri sunarak markanızın öncü tanınır olmasını sağlıyorum. En az iki platformda markanızın reklamını en iyi kreatifler ile 7/24 canlı olarak yayınlıyorum!
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Portfolio Item 4 */}
            <Link href="/hizmetler/marka-kimligi" className="block">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Image src="/brand-identity-icon.png" alt="Marka Oluşturma" width={80} height={80} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <Image src="/brand-identity-icon.png" alt="Brand" width={32} height={32} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Sizin İçin Markanızı Oluşturalım!</h3>
                  <p className="text-lg font-black text-gray-600">
                    Siz yada markanız için en iyi kurumsal tasarımlar ile lider olmanızı sağlıyorum. Her adım verimliliğe aşıktır.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/hizmetler"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Tüm Çalışmalarıma Göz Atın!
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-600">
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
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                WhatsApp ile İletişim
              </Link>
              <Link 
                href="/iletisim"
                className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
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

