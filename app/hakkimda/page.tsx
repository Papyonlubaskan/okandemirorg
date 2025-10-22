import Image from 'next/image'
import Link from 'next/link'
import YouTubeFeed from '@/components/YouTubeFeed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Okan Demir Kimdir? - Dijital Pazarlama Uzmanı Hakkında",
  description: "Okan Demir kimdir? Türkiye'nin önde gelen dijital pazarlama uzmanı, web tasarımcı ve e-ticaret platform uzmanı. 5+ yıl deneyim, 50+ proje. Ticimax, İdeasoft, İkas uzmanı.",
  keywords: ["Okan Demir", "Okan", "Dijital Pazarlama Uzmanı", "Web Tasarımcı", "E-ticaret Uzmanı", "Ticimax", "İdeasoft", "İkas", "SEO Uzmanı"],
  openGraph: {
    title: "Okan Demir Kimdir? - Dijital Pazarlama Uzmanı",
    description: "Okan Demir kimdir? Türkiye'nin önde gelen dijital pazarlama uzmanı, web tasarımcı ve e-ticaret platform uzmanı.",
  },
}

export default function Hakkimda() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Photo */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <Image
                  src="/okan-about-photo.webp"
                  alt="Okan Demir"
                  width={768}
                  height={894}
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain max-w-md"
                />
              </div>
            </div>
            
            {/* Right Content - Text */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                  <span className="block text-white">Okan Demir</span>
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Kimdir?
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-tight font-black">
                  Dijital dünyada markanızı öne çıkaran, yaratıcı çözümlerle işinizi büyüten profesyonel bir dijital pazarlama uzmanıyım.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                  Randevu Al!
                </Link>
                <Link 
                  href="/iletisim"
                  className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
                >
                  <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                  İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yaratıcı Dünyama Hoş Geldiniz Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Yaratıcı Dünyama Hoş Geldiniz
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-200 leading-tight font-black">
                Tasarım ve dijital dönüşüm dünyasına yolculuğum, yaratıcılık ve teknolojinin kesişim noktasına hayran kaldığım lise yıllarımda başladı. Görsel hikaye anlatımının gücünden ilham alarak, amatör seviyede YouTube vb. platformlar üzerinden yayıncılığa başladım.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 lg:p-12 mb-16">
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-tight font-black text-center mb-6">
                Bugün, harika planlamaların ve tasarımın sadece estetikle ilgili olmadığına; markalar ve hedef kitleleri arasında anlamlı bağlantılar kurmakla ilgili olduğuna olan inancımla hareket ediyorum. Bu inancımı geçmiş tecrübelerim ve siyasi yaşamım ile elde ettiğimi düşünerek, vizyon ve misyon sorumluluğumu bir adım öteye sizin sayenizde taşıyabilirim!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">07 Mart 1993</div>
                  <p className="text-gray-700 dark:text-gray-300 font-black">Doğum Tarihi</p>
                  <p className="text-gray-600 dark:text-gray-300">Bornova, İzmir</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">♓ Balık</div>
                  <p className="text-gray-700 dark:text-gray-300 font-black">Burç</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-blue-600 mb-2">32 Yaşında</div>
                  <p className="text-gray-700 dark:text-gray-300 font-black">Yaş</p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link 
                  href="https://www.biyografiler.com/kimdir/okan-demir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Detaylı Biyografi İçin Tıkla
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* İş & Kariyer Deneyimim Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                İş & Kariyer Deneyimim
              </h2>
            </div>

            <div className="space-y-8">
              {/* Milletvekilliği Adaylığı */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xl">🏛️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      28.Dönem İzmir 2.Bölge 2.Sıra Milletvekilliği Adaylığı
                    </h3>
                    <p className="text-lg text-blue-600 font-black mb-2">Güç Birliği Partisi</p>
                    <p className="text-gray-600 dark:text-gray-300 font-black">Haz 2023 &apos;teydi</p>
                  </div>
                </div>
              </div>

              {/* Tasarım Uzmanı */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xl">💻</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      Tasarım - Web - Dijital Pazarlama Uzmanı & Streamer(Yayıncı) - LR Healty & Beauty(İş Ortağı)
                    </h3>
                    <p className="text-lg text-green-600 font-black mb-2">Freelancer</p>
                    <p className="text-gray-600 dark:text-gray-300 font-black">Kas 2008 - Haz 2025</p>
                  </div>
                </div>
              </div>

              {/* Denizci */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xl">⚓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      Denizci
                    </h3>
                    <p className="text-lg text-indigo-600 font-black mb-2">Gemi Makineleri</p>
                    <p className="text-gray-600 dark:text-gray-300 font-black">Tem 2011 - Kas 2019</p>
                  </div>
                </div>
              </div>

              {/* Basın Danışmanlığı */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xl">📰</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      Basın Danışmalığı & Gençlik Kolları Genel Başkanı
                    </h3>
                    <p className="text-lg text-purple-600 font-black mb-2">Türkiye Uyanış Partisi</p>
                    <p className="text-gray-600 dark:text-gray-300 font-black">May 2024 - Haz 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benim Dünyam Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Benim Dünyam
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-200 leading-tight font-black">
                Çalışmadığım zamanlarda.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Instagram Feed */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">Instagram</h3>
                  <a 
                    href="https://www.instagram.com/okandemirorg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-pink-600 dark:from-gray-600 dark:to-gray-700 hover:from-blue-700 hover:to-pink-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white px-4 py-2 rounded-full font-black text-sm transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Takip Et
                  </a>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-black">Son paylaşımlarım ve dijital pazarlama ipuçları</p>
                  <div className="w-full" style={{ height: '500px' }}>
                    <iframe
                      src="https://www.instagram.com/okandemirorg/embed"
                      className="w-full h-full rounded-2xl"
                      style={{ border: 'none' }}
                      scrolling="no"
                      allow="encrypted-media"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* YouTube Videos */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white">YouTube</h3>
                  <a 
                    href="https://www.youtube.com/@PapyonluBaskan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-black text-sm transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Abone Ol
                  </a>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 font-black">En son video içeriklerim ve eğitimler</p>
                  <YouTubeFeed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dijital Dönüşüm Felsefem Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Dijital Dönüşüm Felsefem
              </h2>
              <p className="text-xl text-blue-100 leading-tight font-black">
                Bugün, harika dijital pazarlama çözümleri ve kreatif tasarımın yalnızca estetikle ilgili olmadığına; markalar ve hedef kitleleri arasında anlamlı bağlantılar kurmakla ilgili olduğuna inanıyorum. Dünya genelinde yapılan çalışmalar bu inancımı destekleyen niteliktedir. Sürekli öğrenmeye ve yeniliğe kendimi adadım. Dijital dönüşüm çözümlerim ile tasarımlarımın sadece harika görünmekle kalmayıp aynı zamanda sonuç da vermesini sağlıyorum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4">Amaçlı Deneyimler Yaratmak</h3>
                <p className="text-blue-100 font-black">Her proje için anlamlı ve hedef odaklı deneyimler tasarlıyorum.</p>
              </div>
              <div className="bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4">Kullanıcı Odaklı Yaklaşım</h3>
                <p className="text-blue-100 font-black">Kullanıcı ihtiyaçlarını öncelikli tutarak çözümler geliştiriyorum.</p>
              </div>
              <div className="bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4">Yenilik ve Uyum, Süreklilik</h3>
                <p className="text-blue-100 font-black">Sürekli öğrenme ve teknolojik yenilikleri takip ediyorum.</p>
              </div>
              <div className="bg-white dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-4">İşbirliği ve Kesintisiz İletişim</h3>
                <p className="text-blue-100 font-black">Müşterilerimle sürekli iletişim halinde kalarak başarıya ulaşıyorum.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-ticaret Platform Uzmanlığım Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                E-ticaret Platform Uzmanlığım
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-tight">
                Türkiye&apos;nin önde gelen e-ticaret platformlarında uzmanlaşmış, profesyonel çözümler sunuyorum.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ticimax */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Ticimax</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 font-black">
                  Türkiye&apos;nin en popüler e-ticaret platformu olan Ticimax&apos;te kurulum, özelleştirme ve optimizasyon konularında uzmanım.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                  <li>✓ Kurulum & Konfigürasyon</li>
                  <li>✓ Tema Özelleştirme</li>
                  <li>✓ SEO Optimizasyonu</li>
                  <li>✓ Entegrasyonlar</li>
                </ul>
              </div>

              {/* İdeasoft */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İdeasoft</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 font-black">
                  İdeasoft platformunda tasarım, entegrasyon ve teknik geliştirme konularında deneyimliyim.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                  <li>✓ Tasarım & UI/UX</li>
                  <li>✓ API Entegrasyonları</li>
                  <li>✓ Özel Geliştirmeler</li>
                  <li>✓ Performans Optimizasyonu</li>
                </ul>
              </div>

              {/* İkas */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İkas</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 font-black">
                  İkas platformunda özelleştirme, SEO ve dijital pazarlama entegrasyonları konularında uzmanım.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                  <li>✓ Özelleştirme & Tasarım</li>
                  <li>✓ SEO & Dijital Pazarlama</li>
                  <li>✓ Analytics Entegrasyonu</li>
                  <li>✓ Mobil Optimizasyon</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                href="/hizmetler"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-600 dark:to-gray-700 hover:from-blue-700 hover:to-purple-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Tüm Hizmetlerimi Gör
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Aklınızda Bir Proje Var Mı?
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-400 font-black mb-8">
              Fikirlerinizi Gerçeğe Dönüştürelim.
            </h3>
            <p className="text-xl text-gray-300 mb-8 font-black">
              info@okandemir.org
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="mailto:info@okandemir.org"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                Email Gönder
              </Link>
              <Link
                href="https://wa.me/+905552677739"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                WhatsApp İletişim
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
