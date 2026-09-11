/** Tüm müşteri iletişimi WhatsApp. IBAN / ödeme sitede yok. */

export const PAYMENT_WHATSAPP = '905552677739'

export function waUrl(text: string): string {
  return `https://wa.me/${PAYMENT_WHATSAPP}?text=${encodeURIComponent(text)}`
}

export function paymentWhatsAppUrl(orderCode: string, amountLabel: string): string {
  return waUrl(`Merhaba, ${orderCode} siparişi (${amountLabel}) için ödeme bilgisi istiyorum.`)
}

export function dekontWhatsAppUrl(orderCode: string): string {
  return waUrl(`Merhaba, ${orderCode} siparişi için havale yaptım. Dekont ekliyorum.`)
}

export function leadWhatsAppUrl(): string {
  return waUrl(
    'Merhaba, ücretsiz “KOBİ’lerin 7 SEO Hatası” rehberini WhatsApp’tan istiyorum.'
  )
}

export function productWhatsAppUrl(productName: string, priceLabel: string): string {
  return waUrl(
    `Merhaba, ${productName} (${priceLabel}) hakkında bilgi / satın alma için yazıyorum.`
  )
}
