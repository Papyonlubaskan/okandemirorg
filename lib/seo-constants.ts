import type { Metadata } from 'next'

/** Programatik (şablon) sayfalar — canlı kalır, Google dizine almaz */
export const PROGRAMMATIC_NOINDEX: NonNullable<Metadata['robots']> = {
  index: false,
  follow: true,
}

export const SITE_BASE = 'https://okandemir.org'
