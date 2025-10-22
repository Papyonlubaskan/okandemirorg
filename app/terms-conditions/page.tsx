export default function TermsConditionsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Kullanım Şartları</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Bu kullanım şartları, Okan Demir (okandemir.org) web sitesini kullanımınızı düzenler.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Hizmet Kullanımı</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Web sitemizi kullanarak aşağıdaki şartları kabul etmiş olursunuz:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6">
            <li>Web sitesini yasal amaçlarla kullanacaksınız</li>
            <li>Başkalarının haklarını ihlal etmeyeceksiniz</li>
            <li>Zararlı içerik paylaşmayacaksınız</li>
          </ul>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Fikri Mülkiyet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Web sitesindeki tüm içerik, tasarım ve yazılım Okan Demir&apos;e aittir ve telif hakkı koruması altındadır.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Sorumluluk Sınırlaması</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Web sitesinin kullanımından doğabilecek zararlardan sorumlu değiliz. Hizmetlerimiz &ldquo;olduğu gibi&rdquo; sunulmaktadır.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Değişiklikler</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bu şartları önceden haber vermeksizin değiştirme hakkımız saklıdır.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İletişim</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Sorularınız için info@okandemir.org adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  )
}
