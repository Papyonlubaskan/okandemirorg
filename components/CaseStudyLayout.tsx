import Link from 'next/link'
import Script from 'next/script'
import type { ReactNode } from 'react'

type CaseStudyLayoutProps = {
  slug: string
  headline: string
  subtitle: string
  tags: string[]
  liveUrl: string
  liveLabel: string
  datePublished: string
  aboutName: string
  children: ReactNode
}

export default function CaseStudyLayout({
  slug,
  headline,
  subtitle,
  tags,
  liveUrl,
  liveLabel,
  datePublished,
  aboutName,
  children,
}: CaseStudyLayoutProps) {
  const pageUrl = `https://okandemir.org/case-studies/${slug}`

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    headline,
    description: subtitle,
    image: 'https://okandemir.org/okan-demir-profile.webp',
    author: {
      '@type': 'Person',
      name: 'Okan Demir',
      url: 'https://okandemir.org/hakkimda',
    },
    datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    about: { '@type': 'WebSite', name: aboutName, url: liveUrl },
  }

  return (
    <>
      <Script
        id={`case-study-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Ana Sayfa
                </Link>
                {' › '}
                <Link href="/projeler#tamamlanan-isler" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Projeler
                </Link>
                {' › '}
                <span className="text-gray-900 dark:text-white font-black">{headline}</span>
              </nav>

              <header className="text-center mb-12">
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-black mb-4">
                  Case Study
                </span>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                  {headline}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-6">{subtitle}</p>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full font-black shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12 space-y-6 text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                {children}
              </article>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-black transition-all hover:scale-105"
                >
                  {liveLabel}
                </Link>
                <Link
                  href="/projeler#tamamlanan-isler"
                  className="inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-full font-black transition-all"
                >
                  Tüm Projeler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
