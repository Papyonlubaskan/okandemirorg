export default function UserDataDeletionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Kullanıcı Verisi Silme
          </h1>
          
          <div className="prose prose-lg text-gray-700">
            <p>
              Bu sayfa, kullanıcı verilerinin silinmesi için Facebook tarafından kullanılır.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Veri Silme Politikamız
            </h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Kullanıcılarımızın verilerini silme taleplerini 30 gün içinde işleme alırız</li>
              <li>Kişisel veriler tamamen silinir ve geri alınamaz</li>
              <li>Yasal yükümlülükler saklı kalmak kaydıyla tüm veriler silinir</li>
              <li>Veri silme işlemi ücretsizdir</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              İletişim
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <p><strong>E-posta:</strong> info@okandemir.org</p>
              <p><strong>Telefon:</strong> +90 555 267 77 39</p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/+905552677739" className="text-blue-600 hover:underline">Hemen İletişim</a></p>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-800">
                <strong>Not:</strong> Bu sayfa Facebook Developer Console&apos;da &quot;User data deletion URL&quot; 
                olarak kullanılmaktadır ve API endpoint&apos;i olarak çalışır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
