/** SEO metadata icin Turkce + Ingilizce birlestirme yardimcilari */

export function bilingualDescription(tr: string, en: string): string {
  return `${tr} | ${en}`
}

export function bilingualKeywords(tr: string[], en: string[]): string[] {
  return [...tr, ...en]
}
