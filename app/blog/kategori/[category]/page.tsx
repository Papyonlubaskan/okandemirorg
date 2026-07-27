import { Metadata } from 'next'
import Link from 'next/link'
import { blogCategories } from '@/lib/blog-data'
import { notFound } from 'next/navigation'
import { PROGRAMMATIC_NOINDEX } from '@/lib/seo-constants'

export async function generateStaticParams() {
  return blogCategories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const category = blogCategories.find((c) => c.slug === resolvedParams.category)
  
  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    }
  }

  return {
    title: `${category.name} - Blog Kategorisi | Okan Demir`,
    description: category.description,
    keywords: `${category.name}, ${category.slug}, dijital pazarlama, SEO`,
    robots: PROGRAMMATIC_NOINDEX,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = blogCategories.find((c) => c.slug === resolvedParams.category)

  if (!category) {
    notFound()
  }

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
              {category.name}
            </h1>
            <p className="text-xl text-blue-100 font-black mb-8">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Gerçek sayfalar — 404 thin blog linki yok */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              href="/blog/dijital-pazarlama-trendleri-2025"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                2025 Dijital Pazarlama Trendleri
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Güncel stratejiler ve uygulama notları
              </p>
              <span className="text-blue-600 dark:text-blue-400 font-black">Oku →</span>
            </Link>
            <Link
              href="/hizmetler"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Profesyonel Hizmetler
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                SEO, web tasarım, Ads ve e-ticaret
              </p>
              <span className="text-blue-600 dark:text-blue-400 font-black">İncele →</span>
            </Link>
            <Link
              href="/iletisim"
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                İletişime Geç
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Projeniz için ücretsiz danışmanlık
              </p>
              <span className="text-blue-600 dark:text-blue-400 font-black">Yaz →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

