// Form validation utility functions

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject?: string
  message: string
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (Turkish format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Name validation
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50
}

// Message validation
export const isValidMessage = (message: string): boolean => {
  return message.trim().length >= 10 && message.trim().length <= 1000
}

// Company validation
export const isValidCompany = (company: string): boolean => {
  if (!company) return true // Optional field
  return company.trim().length >= 2 && company.trim().length <= 100
}

// Subject validation
export const isValidSubject = (subject: string): boolean => {
  if (!subject) return true // Optional field
  return subject.trim().length >= 3 && subject.trim().length <= 200
}

// Sanitize input (remove special characters except allowed ones)
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '') // Remove HTML tags
}

// Validate contact form
export const validateContactForm = (data: ContactFormData): ValidationResult => {
  const errors: Record<string, string> = {}

  // Name validation
  if (!data.name || !isValidName(data.name)) {
    errors.name = 'İsim en az 2, en fazla 50 karakter olmalıdır'
  }

  // Email validation
  if (!data.email) {
    errors.email = 'E-posta adresi gereklidir'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz'
  }

  // Phone validation (optional)
  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Geçerli bir telefon numarası giriniz (örn: 5551234567)'
  }

  // Company validation (optional)
  if (data.company && !isValidCompany(data.company)) {
    errors.company = 'Şirket adı en az 2, en fazla 100 karakter olmalıdır'
  }

  // Subject validation (optional)
  if (data.subject && !isValidSubject(data.subject)) {
    errors.subject = 'Konu en az 3, en fazla 200 karakter olmalıdır'
  }

  // Message validation
  if (!data.message || !isValidMessage(data.message)) {
    errors.message = 'Mesaj en az 10, en fazla 1000 karakter olmalıdır'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
  }
  return phone
}

// Check for spam patterns
export const isLikelySpam = (message: string): boolean => {
  const spamPatterns = [
    /viagra/i,
    /casino/i,
    /lottery/i,
    /click here/i,
    /free money/i,
    /congratulations/i,
  ]

  return spamPatterns.some((pattern) => pattern.test(message))
}

// Rate limiting helper (client-side)
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  if (typeof window === 'undefined') return true

  const now = Date.now()
  const storageKey = `rateLimit_${key}`
  const stored = localStorage.getItem(storageKey)

  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }))
    return true
  }

  const data = JSON.parse(stored)
  const timeDiff = now - data.timestamp

  if (timeDiff > windowMs) {
    // Reset window
    localStorage.setItem(storageKey, JSON.stringify({ count: 1, timestamp: now }))
    return true
  }

  if (data.count >= limit) {
    return false // Rate limit exceeded
  }

  // Increment count
  data.count += 1
  localStorage.setItem(storageKey, JSON.stringify(data))
  return true
}

