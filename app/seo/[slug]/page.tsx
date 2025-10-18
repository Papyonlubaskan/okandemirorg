import { Metadata } from 'next'
import Link from 'next/link'
import { generateSEOPages } from '@/lib/seo-data-generator'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const pages = generateSEOPages()
  return pages.slice(0, 100).map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const pages = generateSEOPages()
  const page = pages.find((p) => p.slug === resolvedParams.slug)
  
  if (!page) {
    return {
      title: 'Sayfa Bulunamadı',
    }
  }

  return {
    title: `${page.title} | Okan Demir`,
    description: page.description,
    keywords: page.keywords.join(', '),
  }
}

export default async function SEOPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const pages = generateSEOPages()
  const page = pages.find((p) => p.slug === resolvedParams.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-blue-600 dark:text-blue-400">Ana Sayfa</Link>
              {' > '}
              <Link href="/blog" className="hover:text-blue-600 dark:text-blue-400">Blog</Link>
              {' > '}
              <span className="text-gray-900 dark:text-white font-black">{page.category}</span>
            </nav>

            {/* Header */}
            <header className="mb-12">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-black">
                  {page.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {page.h1}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {page.description}
              </p>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 lg:p-12 mb-8">
                {page.h2s.map((h2, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                      {h2}
                    </h2>
                    <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-black">
                      {page.category} alanında uzman bir dijital pazarlama danışmanı olarak, 
                      5+ yıllık deneyimimle işletmelere başarılı stratejiler sunuyorum. 
                      Bu rehberde, {page.h1.toLowerCase()} konusunda bilmeniz gereken her şeyi 
                      detaylı olarak anlatacağım.
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4 text-gray-700 dark:text-gray-300">
                      <li className="font-black">Kapsamlı strateji geliştirme</li>
                      <li className="font-black">Pratik uygulama adımları</li>
                      <li className="font-black">Ölçülebilir sonuçlar</li>
                      <li className="font-black">Sürekli optimizasyon</li>
                    </ul>
                  </div>
                ))}

                {/* CTA Box */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 my-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    💡 Profesyonel Destek Alın
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 font-black mb-4">
                    {page.h1} konusunda profesyonel yardım mı arıyorsunuz? 
                    5+ yıllık deneyimim ile size özel stratejiler geliştirebilirim.
                  </p>
                  <Link
                    href="/iletisim"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-black transition-all duration-300 hover:scale-105"
                  >
                    Ücretsiz Danışmanlık Alın
                  </Link>
                </div>

                {/* FAQs */}
                {page.faqs.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                      Sıkça Sorulan Sorular
                    </h2>
                    <div className="space-y-4">
                      {page.faqs.map((faq, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                          <h4 className="font-black text-gray-900 dark:text-white mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div className="mt-12">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">İlgili Konular:</h3>
              <div className="flex flex-wrap gap-2">
                {page.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-black"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white text-center">
              <h3 className="text-3xl font-black mb-4">
                Dijital Pazarlama Hedeflerinize Ulaşın
              </h3>
              <p className="text-xl text-blue-100 mb-6 font-black">
                {page.h1} konusunda uzman desteği için benimle iletişime geçin
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-black text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                >
                  İletişime Geç
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center bg-white dark:bg-gray-800/20 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-white dark:bg-gray-800/30 transition-all duration-300 hover:scale-105"
                >
                  Diğer İçerikler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

