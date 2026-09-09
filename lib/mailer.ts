import nodemailer from 'nodemailer'

export function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'okandemir.org',
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER || 'info@okandemir.org',
      pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
    },
  })
}

export const MAIL_FROM = process.env.EMAIL_FROM || 'info@okandemir.org'
export const MAIL_ADMIN = process.env.EMAIL_ADMIN || 'info@okandemir.org'
