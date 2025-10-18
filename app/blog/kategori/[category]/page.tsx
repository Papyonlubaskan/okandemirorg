import { Metadata } from 'next'
import Link from 'next/link'
import { blogCategories, generateBlogPosts } from '@/lib/blog-data'
import { notFound } from 'next/navigation'

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
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params
  const category = blogCategories.find((c) => c.slug === resolvedParams.category)

  if (!category) {
    notFound()
  }

  const posts = generateBlogPosts()
  const categoryPosts = posts.filter((p) => p.category === category.name).slice(0, 24)

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
            <div className="inline-block bg-white dark:bg-gray-800/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-black">{category.count}+ Makale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105"
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
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  Devamını Oku →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-xl font-black text-gray-700">
              Ve daha {category.count - 24}+ makale bu kategoride...
            </p>
          </div>
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
            Diğer Kategoriler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {blogCategories
              .filter((c) => c.id !== category.id)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/kategori/${cat.slug}`}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <span className="font-black text-gray-900 dark:text-white">{cat.name}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{cat.count}+</div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

