import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veri Silme Durumu | Okan Demir',
  description: 'Kullanıcı veri silme talebinizin işlem durumu ve süreç bilgileri.',
  robots: { index: false, follow: false },
}

export default function DataDeletionStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            ✅ Veri Silme Durumu
          </h1>
          
          <div className="prose prose-lg text-gray-700">
            <p>
              Veri silme talebiniz başarıyla alınmıştır.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              📋 İşlem Durumu
            </h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Veri silme talebi 30 gün içinde işleme alınacaktır</li>
              <li>Kişisel verileriniz tamamen silinecektir</li>
              <li>Yasal yükümlülükler saklı kalmak kaydıyla tüm veriler silinir</li>
              <li>İşlem tamamlandığında e-posta ile bilgilendirileceksiniz</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              📞 İletişim
            </h2>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <p><strong>📧 E-posta:</strong> info@okandemir.org</p>
              <p><strong>📱 Telefon:</strong> +90 555 267 77 39</p>
              <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/+905552677739" className="text-blue-600 hover:underline">Hemen İletişim</a></p>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-blue-800">
                <strong>Not:</strong> Bu sayfa Facebook tarafından veri silme işlemi için kullanılmaktadır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
