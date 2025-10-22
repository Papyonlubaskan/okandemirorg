'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { validateContactForm, checkRateLimit, isLikelySpam, formatPhoneNumber } from '@/lib/formValidation'

export default function Iletisim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rateLimit' | 'spam'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitStatus('idle')

    // Rate limiting check (3 submissions per 10 minutes)
    if (!checkRateLimit('contact-form', 3, 600000)) {
      setSubmitStatus('rateLimit')
      return
    }

    // Spam check
    if (isLikelySpam(formData.message)) {
      setSubmitStatus('spam')
      return
    }

    // Validate form
    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
        setErrors({})
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handlePhoneBlur = () => {
    if (formData.phone) {
      setFormData({
        ...formData,
        phone: formatPhoneNumber(formData.phone)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6">
              <span className="block">İletişime</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Geçelim!
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 leading-tight mb-8 font-black">
              Projenizi hayata geçirmek için birlikte çalışalım. Size en uygun çözümü bulalım!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://wa.me/+905552677739"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                WhatsApp ile Hemen İletişim
              </Link>
              <a 
                href="tel:+905552677739"
                className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
              >
                <Image src="/phone-icon.png" alt="Phone" width={24} height={24} className="mr-3" />
                +90 555 267 77 39
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-8">
                Mesaj Gönderin
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <span className="font-black">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <span className="font-black">Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp ile iletişime geçin.</span>
                </div>
              )}

              {submitStatus === 'rateLimit' && (
                <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                  <span className="font-black">Çok fazla mesaj gönderdiniz. Lütfen 10 dakika sonra tekrar deneyin.</span>
                </div>
              )}

              {submitStatus === 'spam' && (
                <div className="mb-6 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded-lg">
                  <span className="font-black">Mesajınız spam filtresi tarafından engellendi. Lütfen uygun bir mesaj yazın.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-lg font-black text-gray-700 dark:text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg bg-white dark:bg-gray-700 font-black ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-gray-500'
                      }`}
                      placeholder="Adınız ve soyadınız"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-lg font-black text-gray-700 dark:text-gray-300 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg bg-white dark:bg-gray-700 font-black ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-gray-500'
                      }`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-lg font-black text-gray-700 dark:text-gray-300 mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handlePhoneBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg bg-white dark:bg-gray-700 font-black ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-gray-500'
                      }`}
                      placeholder="+90 555 123 45 67"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600 font-medium">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-lg font-black text-gray-700 dark:text-gray-300 mb-2">
                      Konu *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-500 focus:border-transparent text-lg bg-white dark:bg-gray-700 font-black"
                    >
                      <option value="">Konu seçin</option>
                      <option value="dijital-pazarlama">Dijital Pazarlama</option>
                      <option value="web-tasarim">Web Tasarımı</option>
                      <option value="marka-tasarim">Marka Tasarımı</option>
                      <option value="dijital-donusum">Dijital Dönüşüm</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-black text-gray-700 dark:text-gray-300 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-lg bg-white dark:bg-gray-700 resize-none ${
                      errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-gray-500'
                    }`}
                    placeholder="Projeniz hakkında detaylı bilgi verin..."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-600 font-medium">{errors.message}</p>}
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {formData.message.length} / 1000 karakter
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-8">
                  İletişim Bilgileri
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image src="/phone-icon.png" alt="Phone" width={24} height={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">Telefon</h4>
                      <a href="tel:+905552677739" className="text-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                        +90 555 267 77 39
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image src="/email-icon.png" alt="Email" width={24} height={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">E-posta</h4>
                      <a href="mailto:info@okandemir.org" className="text-lg text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">
                        info@okandemir.org
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1">WhatsApp</h4>
                      <a href="https://wa.me/+905552677739" className="text-lg text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors">
                        Hemen İletişim
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl lg:text-3xl font-black mb-6">
                  Hızlı Yanıt Garantisi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">✓</span>
                    </div>
                    <span className="text-lg font-black">WhatsApp: Anında yanıt</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">✓</span>
                    </div>
                    <span className="text-lg font-black">E-posta: 24 saat içinde</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-sm">✓</span>
                    </div>
                    <span className="text-lg font-black">Telefon: 09:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Sıkça Sorulan Sorular
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-tight font-black">
                Size en kısa sürede döneceğim
              </p>
            </div>

            <div className="space-y-8">
              {/* Soru 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  Hangi hizmetleri sunuyorsunuz?
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                  Web tasarımı, ön uç geliştirme, UX/UI tasarımı, duyarlı tasarım, e-ticaret çözümleri ve marka kimliği, dijital dönüşümde dijital pazarlama kreatifleri oluşturma gibi çeşitli hizmetler sunuyorum. Ayrıntılı bilgi için Hizmetler sayfamı ziyaret edin.
                </p>
              </div>

              {/* Soru 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  Yeni bir projeye nasıl yaklaşıyorsunuz?
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                  Web tasarımı, ön uç geliştirme, UX/UI tasarımı, duyarlı tasarım, e-ticaret çözümleri ve marka kimliği, dijital pazarlama kreatifleri ve reklam yayınları oluşturma gibi çeşitli hizmetler sunuyorum. Projeye yaklaşım ölçütü sizin mevcut durumunuzla doğrudan bağlantılıdır. Çünkü sahip olduklarınız ve olmadıklarınız üzerinden garantili strateji belirleyerek en iyi sonuca ulaşıyorum. Ayrıntılı bilgi için Hizmetler sayfamı ziyaret edin.
                </p>
              </div>

              {/* Soru 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  Projenizin zaman çizelgesi nedir?
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                  Teslimat ve başlangıç süreçleri mevcut durumunuzun ardından talepleriniz doğrultusunda belirlenen stratejilere göre değişiklik göstermektedir. Ayrıntılı bilgi için Hizmetler sayfamı ziyaret edin.
                </p>
              </div>

              {/* Soru 4 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  Hizmetlerinizin maliyeti ne kadar?
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                  Hizmetlerimizin maliyetleri sizin ve markanızın mevcut durumu göz önüne alınarak talepleriniz ile ihtiyaçlarınız doğrultusunda değişiklik göstermektedir.
                </p>
              </div>

              {/* Soru 5 */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  Hangi platformlarla çalışıyorsunuz?
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                  Dijital dönüşüm artık çağın gerçek bir meselesidir. Bu gerçekliğin getirdiği gereklilikler için dijital pazarlama ve reklam kreatifleri için Google Ads & Meta Ads Business & TikTok Ads & LinkedIn & YouTube & Kick & Twitch & Yandex gibi platformlar üzerinde çalışmalarımı sürdürüyorum. Dijital pazarlama içerisinde sürekli önde olabilmek adına reklamların hiç durmadan devam ediyor olması siz ve markanız için mühim. Web sitesi tasarımlarında özel istek baz alınarak WordPress & Digi & Ticimax & İkas gibi kendisini ispatlamış ve dijital kreatiflerle son derece hızlı, uyumlu olan platformlar ile çalışmayı tercih ediyorum.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-blue-600 rounded-3xl p-12 text-white mt-16">
              <h3 className="text-3xl lg:text-4xl font-black mb-6">
                Aklınızda Bir Proje Var mı?
              </h3>
              <h4 className="text-xl lg:text-2xl text-blue-100 mb-8 font-black">
                Fikirlerinizi Gerçeğe Dönüştürelim
              </h4>
              <p className="text-lg text-blue-100 mb-8 font-black">
                info@okandemir.org
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                  WhatsApp ile İletişim
                </Link>
                <Link 
                  href="mailto:info@okandemir.org"
                  className="inline-flex items-center justify-center bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
                >
                  <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                  E-posta Gönder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
