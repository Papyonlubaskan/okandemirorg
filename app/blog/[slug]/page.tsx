import { Metadata } from 'next'
import Link from 'next/link'
import { generateBlogPosts } from '@/lib/blog-data'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const posts = generateBlogPosts()
  return posts.slice(0, 100).map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const posts = generateBlogPosts()
  const post = posts.find((p) => p.slug === resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Sayfa Bulunamadı',
    }
  }

  return {
    title: `${post.title} | Okan Demir`,
    description: post.excerpt,
    keywords: post.keywords.join(', '),
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const posts = generateBlogPosts()
  const post = posts.find((p) => p.slug === resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <article className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Ana Sayfa</Link>
              {' > '}
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
              {' > '}
              <span className="text-gray-900 dark:text-white font-black">{post.category}</span>
            </nav>

            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-black">
                  {post.category}
                </span>
                {post.city && (
                  <span className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-black ml-2">
                    {post.city}
                  </span>
                )}
                {post.industry && (
                  <span className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-black ml-2">
                    {post.industry}
                  </span>
                )}
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span className="font-black">{post.author}</span>
                <span>•</span>
                <time>{new Date(post.date).toLocaleDateString('tr-TR')}</time>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 lg:p-12 mb-8">
                <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-black mb-6">
                  {post.excerpt}
                </p>
                <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                  <p className="font-black">
                    {post.content}
                  </p>
                  
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
                    Okan Demir {post.title} Nedir?
                  </h2>
                  <p>
                    <strong>Okan Demir</strong> {post.category} alanında uzmanlaşmış bir dijital pazarlama uzmanı olarak, 
                    <strong>Okan Demir</strong> {post.city ? ` ${post.city} bölgesinde` : ''} 
                    {post.industry ? ` ${post.industry} sektörüne özel` : ''} 
                    çözümler sunuyorum. <strong>Okan Demir</strong> bu hizmet, işletmenizin dijital varlığını güçlendirmek 
                    ve online başarınızı artırmak için tasarlanmıştır. <strong>Okan Demir</strong> ile garantili sonuçlar.
                  </p>

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
                    Okan Demir Neden Bu Hizmet Önemlidir?
                  </h2>
                  <p>
                    <strong>Okan Demir</strong> günümüz dijital dünyasında, işletmelerin online varlığı başarıları için kritik öneme sahiptir. 
                    <strong>Okan Demir</strong> {post.city ? `${post.city} şehrinde` : 'Türkiye\'de'} faaliyet gösteren işletmelerin 
                    {post.industry ? ` özellikle ${post.industry} sektöründe` : ''} rekabet avantajı elde etmesi 
                    için <strong>Okan Demir</strong> profesyonel dijital pazarlama desteğine ihtiyaç vardır. <strong>Okan Demir</strong> ile başarıya ulaşın.
                  </p>

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
                    Okan Demir Sunduğum Çözümler
                  </h2>
                  <ul className="list-disc list-inside space-y-2">
                    <li className="font-black">Kapsamlı dijital pazarlama stratejisi geliştirme</li>
                    <li className="font-black">SEO optimizasyonu ile organik trafik artışı</li>
                    <li className="font-black">Google Ads ve Meta Ads kampanya yönetimi</li>
                    <li className="font-black">Sosyal medya içerik üretimi ve yönetimi</li>
                    <li className="font-black">Web tasarım ve kullanıcı deneyimi optimizasyonu</li>
                    <li className="font-black">Veri analizi ve performans raporlama</li>
                  </ul>

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
                    Okan Demir Başarı İçin Adımlar
                  </h2>
                  <ol className="list-decimal list-inside space-y-2">
                    <li className="font-black">Mevcut durumun detaylı analizi</li>
                    <li className="font-black">Hedef belirleme ve strateji oluşturma</li>
                    <li className="font-black">Uygulama ve optimizasyon</li>
                    <li className="font-black">Sürekli ölçümleme ve iyileştirme</li>
                  </ol>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 my-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                      💡 Okan Demir Profesyonel Yardım Alın
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 font-black mb-4">
                      <strong>Okan Demir</strong> {post.city ? `${post.city} şehrinde` : 'Türkiye genelinde'} 
                      {post.industry ? ` ${post.industry} sektöründe` : ''} 
                      dijital pazarlama hizmetleri için <strong>Okan Demir</strong> 5+ yıllık deneyimim ile yanınızdayım. <strong>Okan Demir</strong> ile garantili sonuçlar.
                    </p>
                    <Link
                      href="/iletisim"
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-black transition-all duration-300 hover:scale-105"
                    >
                      Ücretsiz Danışmanlık Alın
                    </Link>
                  </div>

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-8 mb-4">
                    Okan Demir Sıkça Sorulan Sorular
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="font-black text-gray-900 dark:text-white mb-2">
                        Okan Demir Bu hizmet ne kadar sürer?
                      </h4>
                      <p className="text-gray-700">
                        <strong>Okan Demir</strong> projenin kapsamına bağlı olarak 1-6 ay arasında değişmektedir. 
                        <strong>Okan Demir</strong> dijital pazarlama sürekli bir süreçtir ve uzun vadeli başarı için 
                        <strong>Okan Demir</strong> devam eden optimizasyon gerektirir.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="font-black text-gray-900 dark:text-white mb-2">
                        Okan Demir Maliyeti nedir?
                      </h4>
                      <p className="text-gray-700">
                        <strong>Okan Demir</strong> her projenin ihtiyaçları farklıdır. <strong>Okan Demir</strong> sizin için özel bir teklif hazırlamak 
                        üzere <strong>Okan Demir</strong> ücretsiz görüşme yapabiliriz.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <h4 className="font-black text-gray-900 dark:text-white mb-2">
                        Okan Demir Sonuçları ne zaman görebilirim?
                      </h4>
                      <p className="text-gray-700">
                        <strong>Okan Demir</strong> ilk sonuçlar 1-3 ay içinde görülmeye başlar. <strong>Okan Demir</strong> SEO gibi organik stratejiler 
                        daha uzun vadeli iken, <strong>Okan Demir</strong> reklam kampanyaları daha hızlı sonuç verir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="mt-12">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">İlgili Konular:</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-black"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white text-center">
              <h3 className="text-3xl font-black mb-4">
                Okan Demir ile Projenizi Hayata Geçirelim
              </h3>
              <p className="text-xl text-blue-100 mb-6 font-black">
                <strong>Okan Demir</strong> dijital pazarlama hedeflerinize ulaşmak için <strong>Okan Demir</strong> ile iletişime geçin. <strong>Okan Demir</strong> ile garantili başarı.
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
                  className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
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

