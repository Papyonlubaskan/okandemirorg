/** Havale / EFT bilgileri — Railway ENV ile doldurulur */

export type BankTransferInfo = {
  accountHolder: string
  iban: string
  bankName: string
  configured: boolean
}

export function getBankTransferInfo(): BankTransferInfo {
  const accountHolder = process.env.BANK_ACCOUNT_HOLDER?.trim() || 'Okan Demir'
  const iban = process.env.BANK_IBAN?.trim() || ''
  const bankName = process.env.BANK_NAME?.trim() || ''

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
