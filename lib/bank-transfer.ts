/** Havale / EFT bilgileri — Railway ENV ile override edilebilir */

export type BankTransferInfo = {
  accountHolder: string
  iban: string
  bankName: string
  configured: boolean
}

export function getBankTransferInfo(): BankTransferInfo {
  const accountHolder = process.env.BANK_ACCOUNT_HOLDER?.trim() || 'Okan Demir'
  const iban = process.env.BANK_IBAN?.trim() || 'TR630004600634888000161791'
  const bankName = process.env.BANK_NAME?.trim() || 'Akbank'

  return {
    accountHolder,
    iban,
    bankName,
    configured: Boolean(iban),
  }
}

export function buildTransferDescription(orderCode: string): string {
  return orderCode
}

/** Gösterim için IBAN boşluklu format */
export function formatIban(iban: string): string {
  const clean = iban.replace(/\s+/g, '').toUpperCase()
  return clean.replace(/(.{4})/g, '$1 ').trim()
}
