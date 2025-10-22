import Image from 'next/image'
import Link from 'next/link'

export default function ETicaretPlatformlari() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 text-emerald-300 font-black mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-2xl lg:text-3xl xl:text-4xl">E-ticaret Platform Uzmanlığı</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-6">
              Ticimax, İdeasoft & İkas Uzmanı
            </h1>
            <p className="text-xl lg:text-2xl text-emerald-100 leading-tight mb-8">
              Türkiye&apos;nin önde gelen e-ticaret platformlarında uzmanlaşmış, profesyonel çözümlerle işinizi büyütün.
            </p>
            <Link 
              href="https://wa.me/+905552677739"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
              Ücretsiz Danışmanlık Al!
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Detayları */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Platform Uzmanlıklarım
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-tight">
              Her platformun kendine özgü özelliklerini bilen, deneyimli bir uzman olarak hizmetinizdeyim.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticimax */}
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Ticimax</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-tight">
                  Türkiye&apos;nin en popüler e-ticaret platformu olan Ticimax&apos;te kapsamlı deneyimim bulunmaktadır.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h4 className="font-black text-blue-900 mb-2">Kurulum & Konfigürasyon</h4>
                    <p className="text-blue-700">Sıfırdan Ticimax kurulumu ve temel ayarlar</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h4 className="font-black text-blue-900 mb-2">Tema Özelleştirme</h4>
                    <p className="text-blue-700">Markanıza özel tema tasarımı ve kodlama</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h4 className="font-black text-blue-900 mb-2">SEO Optimizasyonu</h4>
                    <p className="text-blue-700">Arama motorları için tam optimizasyon</p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h4 className="font-black text-blue-900 mb-2">Entegrasyonlar</h4>
                    <p className="text-blue-700">Ödeme, kargo ve pazaryeri entegrasyonları</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="https://wa.me/+905552677739?text=Ticimax%20uzmanlığı%20hakkında%20bilgi%20almak%20istiyorum"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Ticimax Danışmanlığı
                  </Link>
                </div>
              </div>
            </div>

            {/* İdeasoft */}
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">İdeasoft</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-tight">
                  İdeasoft platformunda tasarım, entegrasyon ve teknik geliştirme konularında deneyimliyim.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-black text-green-900 mb-2">Tasarım & UI/UX</h4>
                    <p className="text-green-700">Kullanıcı dostu arayüz tasarımı ve deneyim optimizasyonu</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-black text-green-900 mb-2">API Entegrasyonları</h4>
                    <p className="text-green-700">Üçüncü parti sistemlerle entegrasyon çözümleri</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-black text-green-900 mb-2">Özel Geliştirmeler</h4>
                    <p className="text-green-700">İhtiyaçlarınıza özel modül ve özellik geliştirme</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-black text-green-900 mb-2">Performans Optimizasyonu</h4>
                    <p className="text-green-700">Hız ve performans iyileştirme çözümleri</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="https://wa.me/+905552677739?text=İdeasoft%20uzmanlığı%20hakkında%20bilgi%20almak%20istiyorum"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    İdeasoft Danışmanlığı
                  </Link>
                </div>
              </div>
            </div>

            {/* İkas */}
            <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group">
              <div className="relative overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">İkas</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-tight">
                  İkas platformunda özelleştirme, SEO ve dijital pazarlama entegrasyonları konularında uzmanım.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <h4 className="font-black text-purple-900 mb-2">Özelleştirme & Tasarım</h4>
                    <p className="text-purple-700">Markanıza özel tasarım ve özelleştirme çözümleri</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <h4 className="font-black text-purple-900 mb-2">SEO & Dijital Pazarlama</h4>
                    <p className="text-purple-700">Arama motoru optimizasyonu ve dijital pazarlama entegrasyonu</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <h4 className="font-black text-purple-900 mb-2">Analytics Entegrasyonu</h4>
                    <p className="text-purple-700">Google Analytics ve diğer analitik araçların entegrasyonu</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <h4 className="font-black text-purple-900 mb-2">Mobil Optimizasyon</h4>
                    <p className="text-purple-700">Mobil cihazlar için tam optimizasyon</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href="https://wa.me/+905552677739?text=İkas%20uzmanlığı%20hakkında%20bilgi%20almak%20istiyorum"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-black transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    İkas Danışmanlığı
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-gray-800 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              E-ticaret Projenizi Hayata Geçirelim!
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Hangi platform olursa olsun, size en uygun çözümü bulalım.
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
