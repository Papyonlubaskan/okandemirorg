import Link from 'next/link'
import Script from 'next/script'
import {
  completedProjects,
  incompleteProjects,
  getPortfolioItemListSchema,
} from '@/lib/portfolio-projects'

export default function ProjectDeliveryStatus() {
  const itemListSchema = getPortfolioItemListSchema()

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Script
        id="portfolio-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section id="tamamlanan-isler" className="py-20 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm font-black mb-4">
              Teslim Edildi
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Tamamlanan İşler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Canlıya alınmış, müşteri onayıyla teslim edilmiş web projeleri —{' '}
              <Link href="/case-studies/tolgademir-portfolyo" className="text-blue-600 dark:text-blue-400 hover:underline">
                portfolyo
              </Link>{' '}
              ve{' '}
              <Link href="/case-studies/hacettepe-isitme-samsun" className="text-blue-600 dark:text-blue-400 hover:underline">
                kurumsal site
              </Link>{' '}
              proje detayları.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {completedProjects.map((project) => (
              <article
                key={project.domain}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900/30 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-black uppercase tracking-wide">
                      Tamamlandı
                    </span>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400 mb-4">
                    {project.domain}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-black transition-all hover:scale-[1.02]"
                    >
                      Canlı Siteyi Gör
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                    {project.caseStudySlug && (
                      <Link
                        href={`/case-studies/${project.caseStudySlug}`}
                        className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-black transition-all"
                      >
                        Proje Detayı
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tamamlanamayanlar" className="py-16 pb-20 scroll-mt-24 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-sm font-black mb-4">
              Teslim Edilmedi
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Tamamlanamayanlar
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              Süreç içinde sonlandırılan veya müşteri talebiyle durdurulan çalışmalar
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {incompleteProjects.map((project) => (
              <article
                key={project.domain}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-amber-900/30 p-8"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black uppercase tracking-wide">
                    Tamamlanmadı
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-black">
                    {project.note}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm font-black text-gray-500 dark:text-gray-400 mb-4">
                  {project.domain}
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  {project.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
