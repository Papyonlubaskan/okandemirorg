import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KAM Android Uygulaması İndir',
  description:
    'KAM Android uygulaması: telefon sistem sağlığı, güvenlik taraması, müşteri mesajı sesli bildirimi, PC ile koordineli çalışma.',
  robots: { index: true, follow: true },
};

const APK_URL = '/kam/kam.apk';
const APK_MB = '4.3';
const APK_VERSION = '0.2.0';

const FEATURES = [
  { icon: '📱', text: 'Telefon sistem sağlığı ve güvenlik kontrolü' },
  { icon: '🔒', text: 'GitHub repo güvenlik açığı taraması' },
  { icon: '🔔', text: 'Müşteri mesajlarında sesli bildirim' },
  { icon: '💻', text: 'PC ile koordineli çalışma (otomasyonlar PC’de devam eder)' },
  { icon: '🎙️', text: 'Sesli komut ve sohbet' },
  { icon: '♻️', text: 'Kendini güncelleme (OTA) ve yeni özellik alma' },
];

export default function KamDownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] text-white flex items-center justify-center px-4 py-10">
      <div className="max-w-[480px] w-full bg-white/[0.05] border border-white/10 rounded-3xl p-8 sm:p-10 text-center backdrop-blur-md">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-4xl font-bold shadow-[0_8px_32px_rgba(102,126,234,0.3)]">
          K
        </div>

        <h1 className="text-3xl font-bold mb-2">KAM</h1>
        <p className="text-[#a0a0b8] text-[15px] mb-7">
          Okan&apos;ın kişisel yapay zekâ asistanı — telefonunda
        </p>

        <span className="inline-block px-3 py-1 rounded-full bg-[#667eea]/15 text-[#8b9cf0] text-xs mb-6">
          Sürüm {APK_VERSION}
        </span>

        <div className="text-left mb-8">
          {FEATURES.map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-3 py-3 border-b border-white/[0.05] last:border-b-0"
            >
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#667eea]/15 flex items-center justify-center text-xl">
                {f.icon}
              </div>
              <div className="text-sm text-[#d0d0e0]">{f.text}</div>
            </div>
          ))}
        </div>

        <a
          href={APK_URL}
          download
          className="block w-full py-4 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-center text-[17px] font-semibold no-underline shadow-[0_4px_20px_rgba(102,126,234,0.4)] transition active:scale-[0.98]"
        >
          APK İndir ({APK_MB} MB)
        </a>

        <p className="mt-5 text-[13px] text-[#707088]">
          Kurulum için "Bilinmeyen kaynaklara izin ver" gerektirir.
        </p>
        <p className="mt-2 text-[12px] text-[#5a5a70]">
          Android 7.0 ve üzeri gerekir. Güncellemeler uygulama içinden otomatik gelir;
          APK&apos;yı tekrar indirmen gerekmez.
        </p>
      </div>
    </div>
  );
}
