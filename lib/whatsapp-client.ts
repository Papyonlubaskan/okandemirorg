/** WhatsApp Cloud API yardımcıları */

export function normalizeWaPhone(input: string): string {
  return String(input || '').replace(/\D/g, '')
}

export function getOwnerPhone(): string {
  return normalizeWaPhone(process.env.WHATSAPP_OWNER_NUMBER || '905552677739')
}

export function isOwnerPhone(phone: string): boolean {
  return normalizeWaPhone(phone) === getOwnerPhone()
}

export async function sendWhatsAppText(to: string, text: string): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!accessToken || !phoneNumberId) return false

  const recipient = normalizeWaPhone(to)
  if (!recipient) return false

  try {
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: text },
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
