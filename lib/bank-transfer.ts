/** Ödeme bilgisi asla public sayfada / e-postada gösterilmez. WhatsApp özel kanal. */

export const PAYMENT_WHATSAPP = '905552677739'

export function paymentWhatsAppUrl(orderCode: string, amountLabel: string): string {
  const text = `Merhaba, ${orderCode} siparişi (${amountLabel}) için ödeme bilgisi istiyorum.`
  return `https://wa.me/${PAYMENT_WHATSAPP}?text=${encodeURIComponent(text)}`
}

export function dekontWhatsAppUrl(orderCode: string): string {
  const text = `Merhaba, ${orderCode} siparişi için havale yaptım. Dekont ekliyorum.`
  return `https://wa.me/${PAYMENT_WHATSAPP}?text=${encodeURIComponent(text)}`
}
