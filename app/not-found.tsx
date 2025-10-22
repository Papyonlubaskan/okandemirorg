import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <Image
            src="/okan-demir-logo.png"
            alt="Okan Demir Logo"
            width={200}
            height={200}
            className="mx-auto opacity-50"
          />
        </div>
        
        <h1 className="text-6xl font-black mb-4">404</h1>
        <h2 className="text-2xl font-black mb-6">Sayfa Bulunamadı</h2>
        <p className="text-lg mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil. Ana sayfaya dönerek devam edebilirsiniz.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border-2 border-white/30"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          
          <div className="text-sm text-gray-300">
            <p>Eğer bu sayfa olması gereken bir sayfaysa, lütfen bizimle iletişime geçin.</p>
          </div>
        </div>
      </div>
    </div>
  )
}