import type { Metadata } from "next";
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular | Okan Demir - Dijital Pazarlama Uzmanı",
  description: "Okan Demir'e sık sorulan sorular ve cevapları. Dijital pazarlama, web tasarım, SEO, e-ticaret platformları hakkında merak ettiğiniz her şey.",
  keywords: ["Okan Demir SSS", "Dijital Pazarlama SSS", "Web Tasarım SSS", "SEO SSS", "E-ticaret SSS", "Ticimax SSS", "İdeasoft SSS", "İkas SSS"],
  openGraph: {
    title: "Sık Sorulan Sorular | Okan Demir",
    description: "Dijital pazarlama, web tasarım ve e-ticaret konularında sık sorulan sorular ve detaylı cevapları.",
    url: "https://okandemir.org/sss",
  },
};

export default function SSSPage() {
  const faqData = [
    {
      question: "Dijital pazarlama hizmetleri nelerdir?",
      answer: "Dijital pazarlama hizmetlerim arasında SEO optimizasyonu, Google Ads yönetimi, sosyal medya pazarlama, içerik pazarlama, email pazarlama ve web analitik yer almaktadır. Her hizmet, işletmenizin hedeflerine göre özelleştirilir."
    },
    {
      question: "Web tasarım projesi ne kadar sürer?",
      answer: "Web tasarım projelerinin süresi projenin karmaşıklığına bağlıdır. Basit kurumsal web siteleri 2-3 hafta, e-ticaret siteleri 4-6 hafta, özel geliştirmeler ise 6-12 hafta sürebilir. Detaylı zaman çizelgesi proje başında belirlenir."
    },
    {
      question: "SEO çalışmaları ne zaman sonuç verir?",
      answer: "SEO uzun vadeli bir stratejidir. İlk sonuçlar 2-3 ay içinde görülmeye başlar, ancak önemli iyileşmeler 6-12 ay sürebilir. Sürekli optimizasyon ve içerik güncellemeleri ile sonuçlar hızlandırılabilir."
    },
    {
      question: "E-ticaret platformlarından hangisini önerirsiniz?",
      answer: "Ticimax, İdeasoft ve İkas'ın hepsinde uzmanım. Platform seçimi işletmenizin ihtiyaçlarına bağlıdır. Ticimax daha basit ve kullanıcı dostu, İdeasoft orta ölçekli işletmeler için ideal, İkas ise büyük ölçekli projeler için güçlü özellikler sunar."
    },
    {
      question: "Proje ücretlendirmesi nasıl yapılır?",
      answer: "Projelerimiz genellikle sabit fiyat bazlıdır. Kapsamlı analiz sonrası detaylı teklif hazırlanır ve müşteri onayı alınır. Ödeme planı projenin büyüklüğüne göre taksitlendirilebilir."
    },
    {
      question: "Hangi şehirlerde hizmet veriyorsunuz?",
      answer: "İzmir merkezli olarak Türkiye genelinde hizmet veriyorum. İstanbul, Ankara, Bursa, Antalya gibi büyük şehirlerde yoğun olarak çalışıyorum. Online toplantılar ve uzaktan çalışma ile tüm Türkiye'ye hizmet verebilirim."
    },
    {
      question: "Proje sonrası destek veriyor musunuz?",
      answer: "Evet, tüm projelerim için 3 ay ücretsiz teknik destek sağlıyorum. Bu süre içinde ortaya çıkabilecek sorunları ücretsiz çözüyorum. Ayrıca bakım ve güncelleme paketleri de sunuyorum."
    },
    {
      question: "Google Ads yönetimi nasıl yapılır?",
      answer: "Google Ads yönetimimde hedef kitle analizi, anahtar kelime araştırması, kampanya optimizasyonu, A/B testleri ve performans raporlama yer alır. Aylık bütçenize göre maksimum ROI sağlamaya odaklanırım."
    },
    {
      question: "Mevcut web sitemi yenileyebilir misiniz?",
      answer: "Elbette! Mevcut web sitelerinizi modern tasarım ve teknoloji ile yeniliyorum. Eski içerikleri koruyarak, kullanıcı deneyimini iyileştirir ve SEO performansını artırırım."
    },
    {
      question: "Sosyal medya yönetimi hangi platformları kapsar?",
      answer: "Instagram, Facebook, LinkedIn, Twitter, TikTok ve YouTube platformlarında içerik üretimi, paylaşım planlaması, topluluk yönetimi ve analiz hizmetleri sunuyorum. Platform stratejisi işletmenizin hedef kitlesine göre belirlenir."
    },
    {
      question: "İletişim kanallarınız nelerdir?",
      answer: "WhatsApp (+90 555 267 77 39), email (info@okandemir.org), Instagram (@okandemirorg) ve web sitemdeki iletişim formu ile bana ulaşabilirsiniz. En hızlı yanıt WhatsApp üzerinden alırsınız."
    },
    {
      question: "Referanslarınızı görebilir miyim?",
      answer: "Web sitemdeki projeler bölümünde bazı çalışmalarımı inceleyebilirsiniz. Detaylı referans listesi ve müşteri yorumları için benimle iletişime geçebilirsiniz."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
                  Sık Sorulan Sorular
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Dijital pazarlama, web tasarım ve e-ticaret konularında merak ettiğiniz her şeyi burada bulabilirsiniz.
                </p>
              </div>

              {/* FAQ List */}
              <div className="space-y-6">
                {faqData.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white mb-4">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 lg:p-12">
                  <h2 className="text-2xl lg:text-3xl font-black text-white mb-4">
                    Aradığınız Cevabı Bulamadınız Mı?
                  </h2>
                  <p className="text-blue-100 dark:text-gray-300 mb-8">
                    Size özel sorularınız için benimle iletişime geçin.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="https://wa.me/+905552677739"
                      className="inline-flex items-center bg-white text-blue-600 dark:text-white px-6 py-3 rounded-full font-black hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp ile İletişim
                    </a>
                    <a 
                      href="/iletisim"
                      className="inline-flex items-center bg-blue-500 hover:bg-blue-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-6 py-3 rounded-full font-black transition-colors"
                    >
                      İletişim Formu
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
