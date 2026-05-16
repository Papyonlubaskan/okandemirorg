/** Okan Demir doğum tarihi (ISO: YYYY-MM-DD) */
export const OKAN_BIRTH_DATE = '1993-03-07'

export const OKAN_BIRTH_DATE_DISPLAY = '07 Mart 1993'

/** Doğum günü geçmiş mi kontrolü ile güncel yaşı hesaplar */
export function calculateAge(
  birthDate: string = OKAN_BIRTH_DATE,
  referenceDate: Date = new Date()
): number {
  const [year, month, day] = birthDate.split('-').map(Number)
  const birth = new Date(year, month - 1, day)

  let age = referenceDate.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > birth.getMonth() ||
    (referenceDate.getMonth() === birth.getMonth() &&
      referenceDate.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) {
    age -= 1
  }

  return age
}
