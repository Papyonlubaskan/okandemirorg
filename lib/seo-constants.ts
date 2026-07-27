import type { Metadata } from 'next'

/** Programatik thin content — index ve follow kapalı (crawl hygiene) */
export const PROGRAMMATIC_NOINDEX: NonNullable<Metadata['robots']> = {
  index: false,
  follow: false,
}

export const SITE_BASE = 'https://okandemir.org'
