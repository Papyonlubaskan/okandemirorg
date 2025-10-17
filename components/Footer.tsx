import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-300 mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xl mb-6 relative">
              İletişim
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h4>
            
            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <Image src="/phone-icon.png" alt="Phone" width={20} height={20} />
                </div>
                <div>
                  <p className="text-lg text-gray-400">Telefon</p>
                  <Link href="tel:+905552677739" className="text-white font-black hover:text-blue-400 transition-colors">
                    +90 555 267 77 39
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-colors">
                  <Image src="/email-icon.png" alt="Email" width={20} height={20} />
                </div>
                <div>
                  <p className="text-lg text-gray-400">E-posta</p>
                  <Link href="mailto:info@okandemir.org" className="text-white font-black hover:text-red-400 transition-colors">
                    info@okandemir.org
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} />
                </div>
                <div>
                  <p className="text-lg text-gray-400">WhatsApp</p>
                  <Link href="https://wa.me/+905552677739" className="text-white font-black hover:text-green-400 transition-colors">
                    Hemen İletişim
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xl mb-6 relative">
              Hizmetlerim
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></div>
                  Web Tasarımı & Dijital Pazarlama
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:bg-purple-400 transition-colors"></div>
                  WordPress Geliştirme
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:bg-green-400 transition-colors"></div>
                  Marka Kimliği Tasarımı
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:bg-orange-400 transition-colors"></div>
                  Dijital Dönüşüm
                </Link>
              </li>
              <li>
                <Link href="/services" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3 group-hover:bg-pink-400 transition-colors"></div>
                  Sosyal Medya Yönetimi
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-xl mb-6 relative">
              Hızlı Bağlantılar
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-3 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Anasayfa
                </Link>
              </li>
              <li>
                <Link href="/projeler" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-3 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Projeler
                </Link>
              </li>
              <li>
                <Link href="/hizmetler" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-3 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link href="/hakkimda" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-3 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hakkımda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="flex items-center text-gray-400 hover:text-white transition-colors group">
                  <svg className="w-4 h-4 mr-3 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-white font-black text-xl mb-6 relative inline-block">
                Sosyal Medya
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </h4>
            </div>
            
            {/* Social Media Grid */}
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://www.facebook.com/ocopyrightdijitalpazarlamayazilim/" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-blue-600/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/facebook-icon.png" alt="Facebook" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://x.com/papyonlubaskan" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-blue-400/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/twitter-icon.png" alt="Twitter" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.instagram.com/okandemirorg?igsh=MW14MDNkZG10OWF0ZA==" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-pink-600/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/instagram-icon.png" alt="Instagram" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.tiktok.com/@papyonlubaskan?is_from_webapp=1&sender_device=pc" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-black/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/tiktok-icon.png" alt="TikTok" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.youtube.com/@PapyonluBaskan" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-red-600/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/youtube-icon.png" alt="YouTube" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.linkedin.com/in/okan-demir-55a022224/" 
                className="flex items-center justify-center p-3 bg-gray-800/50 rounded-lg hover:bg-blue-700/20 transition-all group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/linkedin-icon.png" alt="LinkedIn" width={20} height={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer with Logo */}
        <div className="border-t border-gray-700 pt-12">
          {/* Logo - Centered Below Navigation */}
          <div className="flex justify-center mb-8">
            <Image
              src="/okan-demir-logo.png"
              alt="Okan Demir"
              width={1000}
              height={1000}
              className="h-32 w-auto"
            />
          </div>
          
          {/* Copyright */}
          <div className="text-center">
            <p className="text-lg text-gray-400">
              <span className="font-black text-white">O Copyright© Dijital Pazarlama & Yazılım</span> Tüm Hakları Saklıdır.
            </p>
            <p className="text-lg text-gray-500 mt-2">
              © 2025 <span className="font-black text-gray-300">Okan Demir</span>
            </p>
            
            {/* Legal Links - Horizontal */}
            <div className="flex justify-center items-center space-x-6 mt-4">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-lg">
                Gizlilik Politikası
              </Link>
              <span className="text-gray-600">|</span>
              <Link href="/terms-conditions" className="text-gray-400 hover:text-white transition-colors text-lg">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

