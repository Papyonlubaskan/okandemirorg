import Link from 'next/link'

export default function Gelisim() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-white dark:bg-gray-800 dark:bg-gray-800/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-6">
              Gelişim
            </h1>
            <p className="text-xl text-green-100 leading-tight mb-8">
              Kalabalık bir pazarda öne çıkmak için güçlü bir marka kimliği ve dijital dönüşüm oluşturmak şarttır.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Strateji Geliştirme</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                İşletmenizin hedeflerine uygun kapsamlı dijital stratejiler geliştiriyoruz. Pazar analizi, rekabet araştırması ve hedef kitle belirleme dahil.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Pazar Analizi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Rekabet Araştırması
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Hedef Kitle Belirleme
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Uygulama & Optimizasyon</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Geliştirdiğimiz stratejileri adım adım uyguluyoruz ve sürekli optimizasyon yaparak en iyi sonuçları elde ediyoruz.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Adım Adım Uygulama
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Performans Takibi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                  Sürekli İyileştirme
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Dijital Dönüşüm Rehberliği</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                İşletmenizin dijital dönüşüm sürecinde size rehberlik ediyoruz. Teknoloji seçimi, süreç optimizasyonu ve değişim yönetimi dahil.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Teknoloji Seçimi
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Süreç Optimizasyonu
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Değişim Yönetimi
                </li>
              </ul>
            </div>
          </div>

          {/* Growth Process */}
          <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-3xl p-12 shadow-lg">
            <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-12">Büyüme Sürecimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">1</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Analiz</h3>
                <p className="text-gray-600 dark:text-gray-300">Mevcut durumunuzu ve potansiyelinizi analiz ediyoruz</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">2</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Planlama</h3>
                <p className="text-gray-600 dark:text-gray-300">Hedeflerinize uygun stratejiler planlıyoruz</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">3</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Uygulama</h3>
                <p className="text-gray-600 dark:text-gray-300">Planları adım adım hayata geçiriyoruz</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">4</div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Optimizasyon</h3>
                <p className="text-gray-600 dark:text-gray-300">Sürekli iyileştirme ve büyüme sağlıyoruz</p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12">
            <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-12">Sürekli İyileştirme ve Analiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Veri Analizi</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Performans verilerinizi düzenli olarak analiz ediyoruz ve iyileştirme fırsatlarını belirliyoruz.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    KPI Takibi
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Raporlama
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Öneriler
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Sürekli Gelişim</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Pazar değişikliklerini takip ederek stratejilerinizi güncel tutuyoruz ve sürekli büyüme sağlıyoruz.
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    Pazar Takibi
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    Strateji Güncelleme
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                    İnovasyon
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-teal-600 dark:from-gray-800 dark:to-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-4xl font-black mb-6">
              Gelişim Yolculuğunuza Başlayalım!
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Sürdürülebilir büyüme için hemen iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://wa.me/+905552677739"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp ile İletişim
              </Link>
              <Link 
                href="/iletisim"
                className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-posta Gönder
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
