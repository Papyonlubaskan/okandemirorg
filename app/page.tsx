import type { Metadata } from 'next'
import Link from 'next/link'
import HeroPrompt from '@/components/home/HeroPrompt'
import { BILLING_SKUS } from '@/lib/billing/catalog'
import { CREDIT_COSTS } from '@/lib/billing/plans'
import { formatTry } from '@/lib/digital-products'

export const metadata: Metadata = {
  title: 'Okan Demir AI | Yapay Zekâ ile Web Sitesi ve Otomatik Dijital Pazarlama',
  description:
    'İşletmeni anlat; yapay zekâ web siteni dakikalar içinde kursun, SEO’nu, içeriğini ve pazarlamanı otomatik yürütsün. Türkçe, WhatsApp entegre, Okan Demir güvencesiyle.',
  alternates: { canonical: 'https://okandemir.org/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://okandemir.org',
    siteName: 'Okan Demir',
    title: 'Okan Demir AI — Siteni ve dijital pazarlamanı yapay zekâ kursun',
    description: 'Web sitesi + otopilot SEO, içerik ve pazarlama. Türkiye’deki işletmeler için.',
    images: [{ url: 'https://okandemir.org/okan-demir-profile.jpg', width: 1200, height: 630, alt: 'Okan Demir AI' }],
  },
  robots: { index: true, follow: true },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
}

const STEPS = [
  ['1', 'Anlat', 'İşletmeni birkaç cümleyle yaz ya da formu doldur. Sektörünü, şehrini ve hedefini seç.'],
  ['2', 'Düzenle', 'Yapay zekâ çok sayfalı, mobil uyumlu siteni hazırlar. Sohbetle veya tıklayarak değiştir.'],
  ['3', 'Büyü', 'Tek tıkla yayınla. Otopilot SEO’nu izler, içerik önerir, müşteri mesajlarını toplar.'],
]

const FEATURES = [
  ['🧠', 'AI site oluşturucu', 'Metinden çok sayfalı site: hizmetler, hakkımızda, SSS, iletişim. Sektörüne özel metin ve renkler.'],
  ['💬', 'Sohbetle düzenleme', '“Fiyat tablosu ekle”, “renkleri koyulaştır” yaz; yeni sürüm hazır. Her sürüm geri alınabilir.'],
  ['📈', 'Otopilot SEO', 'Haftalık otomatik SEO denetimi, öncelikli düzeltme listesi ve sayfa bazlı başlık/açıklama önerileri.'],
  ['✍️', 'İçerik takvimi', 'Blog ve sosyal medya için içerik taslakları. Sen onaylamadan hiçbir şey yayınlanmaz.'],
  ['📲', 'WhatsApp & form', 'Sitedeki form ve WhatsApp butonundan gelen müşteri adayları tek panelde, e-posta bildirimiyle.'],
  ['🎯', 'Reklam asistanı', 'Google ve Meta için kampanya taslağı ve bütçe önerisi. Harcama yalnızca senin onayınla başlar.'],
]

const WHY = [
  ['🇹🇷', 'Türkiye için', 'Türkçe metin, yerel SEO, WhatsApp merkezli müşteri iletişimi.'],
  ['🔒', 'Kontrol sende', 'Yayın, reklam ve harcama gibi her kritik adım onayına sunulur.'],
  ['🤝', 'İnsan desteği', 'Takıldığın yerde Okan Demir ve ekibi WhatsApp’tan yanında.'],
  ['⚡', 'Dakikalar içinde', 'Ajans süreçleri haftalar sürer; ilk taslağın dakikalar içinde hazır.'],
]

const FAQ = [
  ['Ücretsiz deneme var mı?', `Hayır. Platform kredi ile çalışır; site oluşturma ${CREDIT_COSTS['site.generate']} kredi, AI düzenleme ${CREDIT_COSTS['site.edit']} kredidir. Başarısız işlemlerin kredisi otomatik iade edilir.`],
  ['Siteyi yayınlamak için ne gerekir?', 'Aktif bir plan. Plan kapsamındaki site sayısı kadar siteyi yayında tutabilirsin.'],
  ['Ödeme nasıl yapılıyor?', 'Şu an havale/EFT ile. Panelden paketi seçersin, ödeme onaylanınca kredi ve plan hesabına otomatik yüklenir. Kartla ödeme yakında.'],
  ['Kendi alan adımı kullanabilir miyim?', 'Özel alan adı bağlama yakında geliyor. Şimdilik siten okandemir.org/s/... adresinde yayınlanır.'],
  ['Sitemi elle de düzenleyebilir miyim?', 'Evet. Metin, renk, bölüm sırası ve SEO alanlarını kredi harcamadan elle düzenleyebilirsin.'],
]

export default function Home() {
  const plans = BILLING_SKUS.filter((s) => s.kind === 'plan')

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(45,212,191,0.25),transparent),radial-gradient(900px_500px_at_90%_0%,rgba(99,102,241,0.25),transparent)]" />
        <div className="relative container mx-auto px-4 pt-20 pb-24 text-center">
          <p className="inline-block rounded-full border border-teal-300/40 bg-teal-300/10 text-teal-200 text-sm font-bold px-4 py-1.5 mb-6">
            Web sitesi + otopilot dijital pazarlama
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            İşletmeni anlat, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-indigo-300">siten ve pazarlaman</span> hazır olsun
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Yapay zekâ siteni dakikalar içinde kurar; SEO’nu, içeriğini ve müşteri mesajlarını tek panelden otomatik yönetir.
          </p>
          <div className="mt-10">
            <HeroPrompt />
          </div>
          <p className="mt-6 text-sm text-slate-400">
            Zaten hesabın var mı?{' '}
            <Link href="/panel/giris" className="text-teal-300 font-bold underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20" id="nasil-calisir">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Nasıl çalışır?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-slate-900 font-black">{n}</span>
              <h3 className="mt-4 text-xl font-black">{t}</h3>
              <p className="mt-2 text-slate-300">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/60 border-y border-white/10" id="ozellikler">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-black text-center">Site kurmakla bitmiyor</h2>
          <p className="text-center text-slate-300 mt-3 max-w-2xl mx-auto">Siten yayına çıktıktan sonra platform büyümen için çalışmaya devam eder.</p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(([i, t, d]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                <div className="text-3xl">{i}</div>
                <h3 className="mt-3 text-lg font-black">{t}</h3>
                <p className="mt-2 text-slate-300 text-sm">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Neden Okan Demir AI?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY.map(([i, t, d]) => (
            <div key={t} className="text-center">
              <div className="text-4xl">{i}</div>
              <h3 className="mt-3 font-black">{t}</h3>
              <p className="mt-1 text-slate-300 text-sm">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/60 border-y border-white/10" id="fiyatlar">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-black text-center">Fiyatlar</h2>
          <p className="text-center text-slate-300 mt-3">Aylık plan + ihtiyaç kadar ek kredi. Fiyatlara KDV dahil değildir.</p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div key={p.sku} className={`rounded-2xl p-6 flex flex-col ${p.highlighted ? 'bg-teal-400 text-slate-900' : 'border border-white/10 bg-slate-950/60'}`}>
                <h3 className="text-xl font-black">{p.name}</h3>
                <p className={`text-sm ${p.highlighted ? 'text-slate-800' : 'text-slate-400'}`}>{p.description}</p>
                <p className="mt-4 text-4xl font-black">
                  {formatTry(p.priceTry)}
                  <span className="text-base font-bold"> / ay</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Link
                  href="/panel/kredi"
                  className={`mt-6 text-center rounded-xl font-black px-4 py-3 ${p.highlighted ? 'bg-slate-900 text-white' : 'bg-teal-400 text-slate-900'}`}
                >
                  Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10">Sık sorulanlar</h2>
        <div className="space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-3 text-slate-300">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-teal-500 to-indigo-500 p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-black">Bugün başla, siten bu akşam yayında olsun</h2>
          <p className="mt-3 text-teal-50">Kurulum, hosting ve teknik detaylarla uğraşma.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/panel/baslangic" className="rounded-xl bg-white text-slate-900 font-black px-6 py-3">
              Sitemi oluştur
            </Link>
            <Link href="/ajans" className="rounded-xl border border-white/60 text-white font-black px-6 py-3">
              Ajans hizmeti mi istiyorsun?
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
