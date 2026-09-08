import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Blog - Dijital Pazarlama ve SEO İçerikleri',
  description:
    'Okan Demir dijital pazarlama blogu. SEO, web tasarım ve sosyal medya rehberleri.',
  keywords: [
    'dijital pazarlama blog',
    'SEO makaleler',
    'web tasarım rehberleri',
    'sosyal medya ipuçları',
    'Okan Demir blog',
  ],
  alternates: { canonical: 'https://okandemir.org/blog' },
  openGraph: {
    title: 'Blog | Okan Demir',
    description:
      'Okan Demir dijital pazarlama blogu. SEO, web tasarım ve sosyal medya rehberleri.',
    url: 'https://okandemir.org/blog',
    type: 'website',
    images: [
      {
        url: 'https://okandemir.org/okan-demir-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Okan Demir Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Okan Demir',
    description: 'Dijital pazarlama rehberleri ve güncel içerikler.',
  },
}

const INDEXABLE_POSTS = [
  {
    slug: 'dijital-pazarlama-trendleri-2025',
    title: '2025 Dijital Pazarlama Trendleri',
    excerpt:
      '2025 yılında dijital pazarlama dünyasında öne çıkacak trendler: AI, video pazarlama, sesli arama ve kişiselleştirme.',
    category: 'Dijital Pazarlama',
  },
]

export default function BlogPage() {
  return (
    <>
    <BreadcrumbJsonLd id="blog-breadcrumb" items={[{ name: 'Blog', path: '/blog' }]} />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6">
              Dijital Pazarlama Blog
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 font-black mb-8">
              Dijital pazarlama rehberleri ve güncel içerikler
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Öne Çıkan Yazılar
            </h2>
          </div>

          <div className="max-w-3xl mx-auto grid gap-8">
            {INDEXABLE_POSTS.map((post) => (
              <article
                key={post.slug}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              >
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {post.category}
                </span>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mt-3 mb-4">
                  {post.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 font-medium">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex text-blue-600 dark:text-blue-400 font-black hover:text-blue-700"
                >
                  Devamını Oku →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            Dijital Pazarlama Desteği mi Arıyorsunuz?
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-black">
            Profesyonel dijital pazarlama hizmetleri için benimle iletişime geçin
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/iletisim"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105"
            >
              Hemen İletişime Geç
            </Link>
            <Link
              href="/hizmetler"
              className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300"
            >
              Hizmetler
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
