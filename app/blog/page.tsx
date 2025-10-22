import Link from 'next/link'
import { Metadata } from 'next'
import { blogCategories, generateBlogPosts, getTotalPageCount } from '@/lib/blog-data'
import BlogSearch from '@/components/BlogSearch'
import PopularPosts from '@/components/PopularPosts'

export const metadata: Metadata = {
  title: 'Blog - Dijital Pazarlama ve SEO İçerikleri | Okan Demir',
  description: `${getTotalPageCount()}+ dijital pazarlama, SEO, web tasarım ve sosyal medya makalesi. Okan Demir'in profesyonel blog içerikleri.`,
  keywords: 'dijital pazarlama blog, SEO makaleler, web tasarım rehberleri, sosyal medya ipuçları',
}

export default function BlogPage() {
  const allPosts = generateBlogPosts()
  const recentPosts = allPosts.slice(0, 12)
  const totalCount = getTotalPageCount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6">
              Dijital Pazarlama Blog
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 font-black mb-8">
              {totalCount}+ Makale ile Dijital Dünyada Uzmanlaşın
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {blogCategories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/kategori/${category.slug}`}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full font-black transition-all duration-300 hover:scale-105"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Blog Arama
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              İstediğiniz konuyu hızlıca bulun
            </p>
          </div>
          <BlogSearch />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Kategoriler
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              İlgi alanınıza göre içerikleri keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogCategories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/kategori/${category.slug}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {category.name}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 font-black">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-400 font-black">
                    {category.count}+ Makale
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-black">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Son İçerikler
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Recent Posts */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="mb-4">
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{post.author}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Devamını Oku →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PopularPosts />
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-2xl font-black text-gray-700 dark:text-gray-300">
              Ve daha {totalCount - 12}+ makale...
            </p>
          </div>
        </div>
      </section>

      {/* City Services Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Şehir Bazlı Hizmetler
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              81 ilde dijital pazarlama hizmetleri
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Kocaeli', 'Mersin', 'Kayseri', 'Eskişehir'].map((city) => (
              <Link
                key={city}
                href={`/blog/sehir/${city.toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg font-black text-gray-900 dark:text-white">{city}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            Dijital Pazarlama Desteği mi Arıyorsunuz?
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-black">
            Profesyonel dijital pazarlama hizmetleri için benimle iletişime geçin
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500  text-gray-900 dark:text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105"
          >
            Hemen İletişime Geç
          </Link>
        </div>
      </section>
    </div>
  )
}

