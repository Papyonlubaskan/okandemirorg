/**
 * Advanced SEO Analysis Tool
 * Analyzes pages for SEO optimization
 */

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  recommendations: string[]
  performance: {
    loadTime: number
    firstContentfulPaint: number
    largestContentfulPaint: number
    timeToInteractive: number
  }
  meta: {
    title: string
    titleLength: number
    description: string
    descriptionLength: number
    keywords: string[]
  }
  content: {
    wordCount: number
    headings: {
      h1: number
      h2: number
      h3: number
    }
    images: {
      total: number
      withAlt: number
      withoutAlt: number
    }
    links: {
      internal: number
      external: number
      broken: number
    }
  }
  technical: {
    hasRobotsTxt: boolean
    hasSitemap: boolean
    hasSSL: boolean
    isMobileFriendly: boolean
    hasStructuredData: boolean
  }
}

export interface SEOIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  fix: string
}

/**
 * Analyze page for SEO issues
 */
export function analyzePage(url: string, html: string): SEOAnalysis {
  const issues: SEOIssue[] = []
  const recommendations: string[] = []

  // Parse HTML (basic implementation)
  const titleMatch = html.match(/<title>(.*?)<\/title>/i)
  const descriptionMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i)
  const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="(.*?)"/i)
  
  const title = titleMatch ? titleMatch[1] : ''
  const description = descriptionMatch ? descriptionMatch[1] : ''
  const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : []

  // Check title
  if (!title) {
    issues.push({
      severity: 'critical',
      category: 'Meta Tags',
      message: 'Sayfa başlığı eksik',
      fix: '<title> etiketi ekleyin'
    })
  } else if (title.length < 30) {
    issues.push({
      severity: 'warning',
      category: 'Meta Tags',
      message: 'Başlık çok kısa (30 karakterden az)',
      fix: 'Başlığı 50-60 karakter arası yapın'
    })
  } else if (title.length > 60) {
    issues.push({
      severity: 'warning',
      category: 'Meta Tags',
      message: 'Başlık çok uzun (60 karakterden fazla)',
      fix: 'Başlığı 50-60 karakter arası yapın'
    })
  }

  // Check description
  if (!description) {
    issues.push({
      severity: 'critical',
      category: 'Meta Tags',
      message: 'Meta açıklama eksik',
      fix: '<meta name="description"> etiketi ekleyin'
    })
  } else if (description.length < 120) {
    issues.push({
      severity: 'warning',
      category: 'Meta Tags',
      message: 'Açıklama çok kısa (120 karakterden az)',
      fix: 'Açıklamayı 150-160 karakter arası yapın'
    })
  } else if (description.length > 160) {
    issues.push({
      severity: 'info',
      category: 'Meta Tags',
      message: 'Açıklama çok uzun (160 karakterden fazla)',
      fix: 'Açıklamayı 150-160 karakter arası yapın'
    })
  }

  // Count headings
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length

  if (h1Count === 0) {
    issues.push({
      severity: 'critical',
      category: 'Content',
      message: 'H1 başlığı bulunamadı',
      fix: 'Sayfaya bir H1 başlığı ekleyin'
    })
  } else if (h1Count > 1) {
    issues.push({
      severity: 'warning',
      category: 'Content',
      message: `Birden fazla H1 başlığı var (${h1Count})`,
      fix: 'Sayfa başına sadece bir H1 kullanın'
    })
  }

  // Count images
  const images = html.match(/<img[^>]*>/gi) || []
  const imagesWithAlt = images.filter(img => /alt\s*=\s*["'][^"']*["']/i.test(img)).length
  const imagesWithoutAlt = images.length - imagesWithAlt

  if (imagesWithoutAlt > 0) {
    issues.push({
      severity: 'warning',
      category: 'Images',
      message: `${imagesWithoutAlt} görsel alt text'e sahip değil`,
      fix: 'Tüm görsellere açıklayıcı alt text ekleyin'
    })
  }

  // Count links
  const internalLinks = (html.match(/<a[^>]*href\s*=\s*["']\/[^"']*["']/gi) || []).length
  const externalLinks = (html.match(/<a[^>]*href\s*=\s*["']https?:\/\/[^"']*["']/gi) || []).length

  if (internalLinks < 5) {
    recommendations.push('Daha fazla iç bağlantı ekleyin (en az 5-10)')
  }

  // Word count
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = textContent.split(' ').length

  if (wordCount < 300) {
    issues.push({
      severity: 'warning',
      category: 'Content',
      message: 'İçerik çok kısa (300 kelimeden az)',
      fix: 'En az 500-1000 kelime içerik ekleyin'
    })
  }

  // Check technical SEO
  const hasStructuredData = html.includes('application/ld+json')
  const hasCanonical = html.includes('rel="canonical"')
  const hasOpenGraph = html.includes('property="og:')
  const hasTwitterCard = html.includes('name="twitter:')

  if (!hasStructuredData) {
    recommendations.push('Structured Data (Schema.org) ekleyin')
  }

  if (!hasCanonical) {
    recommendations.push('Canonical URL ekleyin')
  }

  if (!hasOpenGraph) {
    recommendations.push('Open Graph meta tags ekleyin')
  }

  if (!hasTwitterCard) {
    recommendations.push('Twitter Card meta tags ekleyin')
  }

  // Calculate score
  let score = 100
  issues.forEach(issue => {
    if (issue.severity === 'critical') score -= 15
    else if (issue.severity === 'warning') score -= 5
    else score -= 2
  })
  score = Math.max(0, score)

  return {
    score,
    issues,
    recommendations,
    performance: {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
    },
    meta: {
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      keywords,
    },
    content: {
      wordCount,
      headings: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count,
      },
      images: {
        total: images.length,
        withAlt: imagesWithAlt,
        withoutAlt: imagesWithoutAlt,
      },
      links: {
        internal: internalLinks,
        external: externalLinks,
        broken: 0,
      },
    },
    technical: {
      hasRobotsTxt: true,
      hasSitemap: true,
      hasSSL: url.startsWith('https'),
      isMobileFriendly: html.includes('viewport'),
      hasStructuredData,
    },
  }
}

/**
 * Get SEO recommendations based on analysis
 */
export function getRecommendations(analysis: SEOAnalysis): string[] {
  const recommendations: string[] = [...analysis.recommendations]

  if (analysis.score < 70) {
    recommendations.unshift('⚠️ SEO skoru düşük - kritik sorunları öncelikle çözün')
  } else if (analysis.score < 85) {
    recommendations.unshift('⚡ SEO skoru iyi - uyarıları çözerek skoru artırabilirsiniz')
  } else {
    recommendations.unshift('✅ SEO skoru mükemmel - küçük iyileştirmeler yapabilirsiniz')
  }

  return recommendations
}

/**
 * Generate SEO report
 */
export function generateSEOReport(analysis: SEOAnalysis): string {
  const criticalIssues = analysis.issues.filter(i => i.severity === 'critical').length
  const warnings = analysis.issues.filter(i => i.severity === 'warning').length
  const info = analysis.issues.filter(i => i.severity === 'info').length

  return `
SEO Analiz Raporu
=================

Skor: ${analysis.score}/100

Sorunlar:
- Kritik: ${criticalIssues}
- Uyarı: ${warnings}
- Bilgi: ${info}

Meta Bilgiler:
- Başlık: ${analysis.meta.title} (${analysis.meta.titleLength} karakter)
- Açıklama: ${analysis.meta.description.substring(0, 50)}... (${analysis.meta.descriptionLength} karakter)

İçerik:
- Kelime Sayısı: ${analysis.content.wordCount}
- H1: ${analysis.content.headings.h1}
- H2: ${analysis.content.headings.h2}
- H3: ${analysis.content.headings.h3}
- Görseller: ${analysis.content.images.total} (${analysis.content.images.withoutAlt} alt text eksik)
- İç Linkler: ${analysis.content.links.internal}
- Dış Linkler: ${analysis.content.links.external}

Teknik:
- SSL: ${analysis.technical.hasSSL ? 'Evet' : 'Hayır'}
- Mobil Uyumlu: ${analysis.technical.isMobileFriendly ? 'Evet' : 'Hayır'}
- Structured Data: ${analysis.technical.hasStructuredData ? 'Evet' : 'Hayır'}

Öneriler:
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
  `.trim()
}

