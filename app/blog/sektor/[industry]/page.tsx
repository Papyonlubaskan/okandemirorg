import { Metadata } from 'next'
import Link from 'next/link'
import { industries, serviceTypes, generateBlogPosts } from '@/lib/blog-data'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return industries.map((industry) => ({
    industry: industry.toLowerCase().replace(/\s+/g, '-'),
  }))
}

function findIndustryBySlug(slug: string): string | undefined {
  return industries.find(industry => 
    industry.toLowerCase().replace(/\s+/g, '-') === slug
  )
}

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const industryName = findIndustryBySlug(resolvedParams.industry)
  
  if (!industryName) {
    return {
      title: 'Sektör Bulunamadı',
    }
  }

  return {
    title: `${industryName} Sektörü Dijital Pazarlama | Okan Demir`,
    description: `${industryName} sektörüne özel dijital pazarlama çözümleri. SEO, Google Ads, sosyal medya yönetimi ve web tasarım hizmetleri.`,
    keywords: `${industryName} dijital pazarlama, ${industryName} SEO, ${industryName} reklam, ${industryName} web tasarım`,
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const resolvedParams = await params
  const industryName = findIndustryBySlug(resolvedParams.industry)

  if (!industryName) {
    notFound()
  }

  const posts = generateBlogPosts()
  const industryPosts = posts.filter((p) => p.industry === industryName).slice(0, 12)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/blog"
              className="inline-block mb-6 text-green-100 hover:text-white transition-colors"
            >
              ← Blog&apos;a Dön
            </Link>
            <h1 className="text-5xl lg:text-6xl font-black mb-6">
              {industryName} Sektörü
            </h1>
            <p className="text-xl text-green-100 font-black mb-8">
              {industryName} Sektörüne Özel Dijital Pazarlama Çözümleri
            </p>
          </div>
        </div>
      </section>

      {/* Industry Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12 mb-12">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                {industryName} Sektörü İçin Dijital Pazarlama
              </h2>
              <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-black mb-6">
                {industryName} sektöründe faaliyet gösteren işletmeler için özel olarak tasarlanmış 
                dijital pazarlama stratejileri ile markanızı öne çıkarın. 5+ yıllık deneyimimle, 
                sektörünüzün özel ihtiyaçlarına uygun çözümler sunuyorum.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 font-black mr-3">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-black">Sektöre özel anahtar kelime stratejisi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-black mr-3">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-black">Rakip analizi ve pazar araştırması</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-black mr-3">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-black">Hedef kitle odaklı içerik üretimi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-black mr-3">✓</span>
                  <span className="text-gray-800 dark:text-gray-200 font-black">Sektörel uzman danışmanlık</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-12 text-center">
            {industryName} İçin Özel Hizmetler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceTypes.slice(0, 9).map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl font-black">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {service}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {industryName} sektörüne özel {service.toLowerCase()} ile rekabette öne geçin.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-black">
                    {industryName}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-black">
                    ROI Odaklı
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-4xl font-black mb-6">
              {industryName} Sektöründe Başarı
            </h2>
            <p className="text-xl text-green-100 mb-8 font-black">
              50+ {industryName} sektörü işletmesine dijital pazarlama hizmeti verdim
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-black mb-2">300%</div>
                <p className="font-black">Ortalama Trafik Artışı</p>
              </div>
              <div className="bg-white dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-black mb-2">5x</div>
                <p className="font-black">ROI Artışı</p>
              </div>
              <div className="bg-white dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-black mb-2">98%</div>
                <p className="font-black">Müşteri Memnuniyeti</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {industryPosts.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
              {industryName} İçin İçerikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industryPosts.map((post) => (
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
                  <span className="text-green-600 font-black">
                    Devamını Oku →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            {industryName} İşletmenizi Büyütmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-black max-w-3xl mx-auto">
            {industryName} sektöründe dijital pazarlama başarısı için ücretsiz danışmanlık alın.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105"
          >
            Ücretsiz Teklif Alın
          </Link>
        </div>
      </section>

      {/* Other Industries */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
            Diğer Sektörler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {industries.slice(0, 24).filter(i => i !== industryName).map((industry) => (
              <Link
                key={industry}
                href={`/blog/sektor/${industry.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="font-black text-gray-900 dark:text-white text-sm">{industry}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

