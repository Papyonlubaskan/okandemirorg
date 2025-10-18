import { Metadata } from 'next'
import Link from 'next/link'
import { cities, serviceTypes, generateBlogPosts } from '@/lib/blog-data'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o'),
  }))
}

function findCityBySlug(slug: string): string | undefined {
  return cities.find(city => 
    city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o') === slug
  )
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const cityName = findCityBySlug(resolvedParams.city)
  
  if (!cityName) {
    return {
      title: 'Şehir Bulunamadı',
    }
  }

  return {
    title: `${cityName} Dijital Pazarlama Hizmetleri | Okan Demir`,
    description: `${cityName} için profesyonel dijital pazarlama, SEO, web tasarım ve sosyal medya yönetimi hizmetleri. Google Ads ve Meta Ads uzmanı.`,
    keywords: `${cityName} dijital pazarlama, ${cityName} SEO, ${cityName} web tasarım, ${cityName} Google Ads, ${cityName} sosyal medya`,
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = await params
  const cityName = findCityBySlug(resolvedParams.city)

  if (!cityName) {
    notFound()
  }

  const posts = generateBlogPosts()
  const cityPosts = posts.filter((p) => p.city === cityName).slice(0, 12)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/blog"
              className="inline-block mb-6 text-blue-100 hover:text-white transition-colors"
            >
              ← Blog&apos;a Dön
            </Link>
            <h1 className="text-5xl lg:text-6xl font-black mb-6">
              {cityName} Dijital Pazarlama
            </h1>
            <p className="text-xl text-blue-100 font-black mb-8">
              {cityName} için Profesyonel Dijital Pazarlama Hizmetleri
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="bg-white dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-full font-black">SEO</span>
              <span className="bg-white dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-full font-black">Google Ads</span>
              <span className="bg-white dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-full font-black">Meta Ads</span>
              <span className="bg-white dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-full font-black">Web Tasarım</span>
              <span className="bg-white dark:bg-gray-800/20 backdrop-blur-sm px-4 py-2 rounded-full font-black">Sosyal Medya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              {cityName} İçin Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-700">
              {cityName} bölgesinde işletmeniz için özel dijital çözümler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceTypes.slice(0, 9).map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-black">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {service}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {cityName} bölgesinde profesyonel {service.toLowerCase()} hizmeti ile işletmenizi büyütün.
                </p>
                <Link
                  href="/iletisim"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-black hover:text-blue-700"
                >
                  Teklif Alın →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-12 text-center">
              {cityName}&apos;da Neden Benimle Çalışmalısınız?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  🎯 Yerel Pazar Bilgisi
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-black">
                  {cityName} ve çevresindeki pazar dinamiklerini anlıyor, hedef kitlenize en etkili şekilde ulaşmanızı sağlıyorum.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  💡 5+ Yıllık Deneyim
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-black">
                  Dijital pazarlama alanında 5+ yıllık deneyimimle {cityName} işletmelerine başarılı projeler sunuyorum.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  📈 Ölçülebilir Sonuçlar
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-black">
                  Her kampanyayı detaylı analiz ediyor, ROI odaklı stratejiler ile somut sonuçlar sunuyorum.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  🤝 Kişiselleştirilmiş Hizmet
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-black">
                  {cityName} bölgesindeki işletmenizin özel ihtiyaçlarına göre özelleştirilmiş çözümler geliştiriyorum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {cityPosts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
              {cityName} İçin İçerikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cityPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-blue-600 dark:text-blue-400 font-black">
                    Devamını Oku →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            {cityName} İşletmenizi Dijital Dünyada Büyütün
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-black max-w-3xl mx-auto">
            {cityName} bölgesinde dijital pazarlama hizmetleri için ücretsiz danışmanlık alın. 
            İşletmeniz için özel strateji oluşturalım.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-black text-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              Ücretsiz Danışmanlık
            </Link>
            <Link
              href="https://wa.me/+905552677739"
              className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105"
            >
              WhatsApp&apos;tan Yazın
            </Link>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
            Diğer Şehirler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cities.slice(0, 24).filter(c => c !== cityName).map((city) => (
              <Link
                key={city}
                href={`/blog/sehir/${city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')}`}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="font-black text-gray-900 dark:text-white">{city}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

