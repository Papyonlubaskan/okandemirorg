export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8">Gizlilik Politikası</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Bu gizlilik politikası, Okan Demir (okandemir.org) web sitesi tarafından toplanan kişisel bilgilerin nasıl kullanıldığını açıklar.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Toplanan Bilgiler</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Web sitemizde aşağıdaki bilgileri toplayabiliriz:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6">
            <li>İletişim formu aracılığıyla sağlanan ad, e-posta ve telefon bilgileri</li>
            <li>Web sitesi kullanımı hakkında anonim istatistikler</li>
            <li>Çerezler (cookies) aracılığıyla toplanan bilgiler</li>
          </ul>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Bilgilerin Kullanımı</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Toplanan bilgiler aşağıdaki amaçlarla kullanılır:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6">
            <li>Müşteri hizmetleri ve iletişim</li>
            <li>Hizmet kalitesinin iyileştirilmesi</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Bilgi Güvenliği</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Kişisel bilgilerinizi korumak için uygun güvenlik önlemlerini alıyoruz. Bilgileriniz üçüncü taraflarla paylaşılmaz.
          </p>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">İletişim</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Gizlilik politikamız hakkında sorularınız için info@okandemir.org adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  )
}
