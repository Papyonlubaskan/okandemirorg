import Link from 'next/link'

export default function AdminHome() {
  const dashboards = [
    {
      title: 'AI Müşteri Analizi',
      description: 'Müşteri başvurularını AI ile analiz edin',
      icon: '🤖',
      link: '/admin/dashboard',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Canlı Performans',
      description: 'Gerçek zamanlı site istatistikleri',
      icon: '📊',
      link: '/admin/analytics',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'SEO Analiz',
      description: 'URL bazlı SEO analizi yapın',
      icon: '🔍',
      link: '/admin/seo',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Anket Sonuçları',
      description: 'Müşteri memnuniyet anketleri',
      icon: '📋',
      link: '/admin/surveys',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Proje Yönetimi',
      description: 'Tüm projeleri yönetin',
      icon: '💼',
      link: '/admin/projects',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Landing Page Builder',
      description: 'Özel landing page oluşturun',
      icon: '🏗️',
      link: '/admin/builder',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-white mb-4">
            ⚡ Admin Kontrol Paneli
          </h1>
          <p className="text-2xl text-gray-300 font-medium">
            Tüm sistemleri tek yerden yönetin
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-black text-white mb-1">10/10</div>
            <div className="text-gray-300 font-medium">Özellik Tamamlandı</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">📄</div>
            <div className="text-3xl font-black text-white mb-1">33</div>
            <div className="text-gray-300 font-medium">Sayfa Build Edildi</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">⚙️</div>
            <div className="text-3xl font-black text-white mb-1">16</div>
            <div className="text-gray-300 font-medium">API Endpoint</div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <Link
              key={dashboard.link}
              href={dashboard.link}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 h-full">
                <div className={`text-6xl mb-4 transition-transform group-hover:scale-110`}>
                  {dashboard.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  {dashboard.title}
                </h2>
                <p className="text-gray-600 font-medium mb-4">
                  {dashboard.description}
                </p>
                <div className={`inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${dashboard.color} font-black`}>
                  Aç
                  <span className="text-2xl">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* System Info */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-black text-white mb-6">📦 Sistem Bilgileri</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-300 mb-3">Kurulu Özellikler:</h3>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li>✅ AI Müşteri Analizi</li>
                <li>✅ Canlı Performans Tracking</li>
                <li>✅ Progressive Web App</li>
                <li>✅ Başarı Hikayeleri Slider</li>
                <li>✅ SEO Analiz Aracı</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-300 mb-3">Ek Özellikler:</h3>
              <ul className="space-y-2 text-gray-400 font-medium">
                <li>✅ Müşteri Memnuniyet Anketi</li>
                <li>✅ 3D Portfolio Galerisi</li>
                <li>✅ Proje Yönetim Paneli</li>
                <li>✅ Landing Page Builder</li>
                <li>✅ WhatsApp Chatbot</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-black text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            🏠 Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}

