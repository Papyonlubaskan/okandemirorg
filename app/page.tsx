import Image from "next/image";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Okan - Okan Demir İzmir | Dijital Pazarlama Uzmanı | Web Tasarım & SEO Uzmanı",
  description: "Okan - Okan Demir İzmir, Türkiye'nin en iyi dijital pazarlama uzmanı. Okan olarak İzmir'de web tasarım, SEO, Google Ads, Meta Business konularında 5+ yıl deneyim. Biyografi.net'te doğrulanmış profil. Okan Demir ile dijital dönüşüm, 50+ başarılı proje, %98 müşteri memnuniyeti.",
  keywords: ["Okan", "Okan Demir", "Okan İzmir", "Okan Demir İzmir", "Dijital Pazarlama Uzmanı Okan", "Web Tasarım Uzmanı Okan", "SEO Uzmanı Okan", "Okan Dijital Pazarlama", "Okan Web Tasarım", "Okan SEO", "Freelance Dijital Pazarlama", "Okan Google Ads", "Okan Meta Business"],
  alternates: {
    canonical: 'https://okandemir.org',
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Text */}
            <div className="space-y-10 lg:space-y-16 flex flex-col justify-between min-h-[600px] lg:min-h-[800px] py-8 lg:py-12">
              <div className="space-y-8 lg:space-y-12 flex-1 flex flex-col justify-center">
                <h1 className="hero-title leading-tight text-center" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 'bold' }}>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-6 lg:mb-8" style={{ fontSize: '64px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 'bold' }}>
                    OKAN DEMİR <span aria-label="telif hakkı">©</span>
                  </span>
                  <span className="block text-white" style={{ fontSize: '48px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 'bold' }}>Sizin İçin Çalışmaya Hazırım!</span>
                </h1>
                
                <p className="hero-description text-gray-100 leading-tight mb-12 font-black" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize: '24px', fontWeight: '500' }}>
                  Okan Demir olarak, doğru strateji + doğru araçlar = gerçek sonuçlar formülüyle çalışıyorum. Dijital pazarlama, dijital dönüşüm, sosyal medya yönetimi, SEO, Google Ads, Meta Business sistem kurulumu ve yüksek dönüşüm odaklı web tasarımı ile daha fazla trafik, daha çok lead, daha yüksek satış için yanınızdayım! Okan Demir ile en iyisini gerçekleştirelim.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="https://wa.me/+905552677739"
                    className="group inline-flex items-center text-white px-10 py-6 rounded-full font-black text-2xl transition-all duration-500 hover:scale-110 touch-manipulation w-full sm:w-auto justify-center focus:outline-none focus:ring-4 bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-700 dark:to-gray-800"
                    aria-label="WhatsApp ile randevu al"
                    role="button"
                  >
                    <Image src="/whatsapp-icon.png" alt="WhatsApp ikonu" width={32} height={32} className="mr-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="group-hover:text-yellow-200 transition-colors duration-300">Randevu Al!</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right Content - Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                  <Image
                  src="/Arka-Plansiz-Photoroom-576x1024.webp" 
                  alt="Okan Demir - Dijital Pazarlama Uzmanı" 
                  width={576} 
                  height={1024}
                  className="w-auto h-auto max-h-[600px] lg:max-h-[800px] object-cover shadow-2xl"
                  loading="eager"
                  priority
                  sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 576px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Sunduklarım */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6" id="services">
              Sunduklarım
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-600 dark:text-blue-400 font-black mb-8">
              Tasarımla, Dijital Dönüşümle Markaları Güçlendirmek
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 dark:from-gray-600 dark:to-gray-700">
                  <Image src="/web-design-icon.png" alt="Web Tasarımı" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Web Tasarımı & Dijital Pazarlama Kreatifleri</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Yaptığım işin temelinde görsel olarak çarpıcı ve kullanıcı dostu eyleme çağrı odaklı dijital pazarlama stratejileri ve web siteleri, çözüm odakları oluşturmak yatıyor.
                </p>
                <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8">
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Yaratıcı Kreatifler
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Duyarlı Düzenlemeler
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Kişiye Özel Tasarım & Dijital Pazarlama Çözümleri
                  </li>
                </ul>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 dark:from-gray-600 dark:to-gray-700">
                  <Image src="/development-icon.png" alt="Gelişim" width={40} height={40} loading="lazy" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Gelişim</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Tasarımlarınızı ve Dijital dönüşüm ihtiyaçlarınızı temiz,verimli,garantili yüksek performanlı kodlarla hayata geçirerek öncü olmanızı sağlıyorum.
                </p>
                <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8">
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    HTML, CSS, & JS Uzmanlığı
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Tarayıcı Arası Uyumluluk & Daha Hızlı Yükleme Süreleri
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Dijital Pazarlamada Süreklilik & Garantili Gelişim
                  </li>
                </ul>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 dark:from-gray-600 dark:to-gray-700">
                  <Image src="/brand-identity-icon.png" alt="Marka Kimliği" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Marka Kimliği</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Kalabalık bir pazarda öne çıkmak için güçlü bir marka kimliği ve dijital dönüşüm oluşturmak şarttır.
                </p>
                <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8">
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Logo Tasarımı&Tutarlı Renk Paletleri& Marka Yönergeleri
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Marka Kimliği Reklamları
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Marka Tanınırlığı İçin Platform Yayınları
                  </li>
                </ul>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-orange-700 hover:bg-orange-800 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Service 4 - E-ticaret Platform Uzmanlığı */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">E-ticaret Platform Uzmanlığı</h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Türkiye&apos;nin önde gelen e-ticaret platformlarında uzmanlaşmış, profesyonel çözümlerle işinizi büyütün.
                </p>
                <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8">
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span><strong>Ticimax</strong> - Kurulum & Optimizasyon</span>
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span><strong>İdeasoft</strong> - Tasarım & Entegrasyon</span>
                  </li>
                   <li className="flex items-center text-lg dark:text-gray-300">
                    <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span><strong>İkas</strong> - Özelleştirme & SEO</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-3">
                  <Link
                    href="https://wa.me/+905552677739"
                    className="inline-flex items-center bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                  >
                    <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                    Randevu Al
                  </Link>
                  <Link
                    href="/hizmetler/e-ticaret-platformlari"
                    className="inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-black transition-colors"
                  >
                    Detayları Gör
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-20 bg-white dark:bg-gray-900" role="region" aria-labelledby="why-choose-me">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-blue-600 font-black mb-6">
              <Image src="/star-icon.png" alt="Yıldız ikonu" width={32} height={32} />
              <span className="text-2xl lg:text-3xl xl:text-4xl">Neden Beni Seçmelisiniz?</span>
            </div>
            <h2 id="why-choose-me" className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white mb-8">
              Neden Benimle Çalışmalısınız?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-blue-500 to-pink-500 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <Image src="/custom-design-icon.png" alt="Custom Design" width={40} height={40} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white transition-colors duration-300">Kişiye ve Markanıza Özel Tasarım</h3>
              <p className="text-xl font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Size Özel Tasarım Her markanın ve sizin eşsiz olduğunuza ve aynı derecede özgün bir web sitesini yada dijital pazarlama çözümlerini hak ettiğine inanıyorum. Dijital dönüşümde de dijital pazarlama uzmanı olarak, Size ve markanıza özel Google Ads & Meta Ads seçenekleri ile, markanızın öncü görünürlüğünü sağlar iken sizin hızlı dönüşüm almanızı sağlıyorum! Garantili stratejiler ile her daim önde ve öncü olacaksınız!
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-blue-500 to-green-500 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <Image src="/user-focused-icon.png" alt="User Focused" width={40} height={40} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white transition-colors duration-300">Kullanıcı Odaklı Yaklaşım</h3>
              <p className="text-xl font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Kullanıcı ve İşletme, Marka Odaklı Yaklaşım; Kullanıcı deneyimine büyük önem vererek, sezgisel ve gezinmesi kolay isteğinize göre E-Ticaret siteleri veya kişisel web siteleri, sosyal medya görünürlüğü tasarlıyorum. Sizin için en iyi yönetimi sağlıyorum. Ayrıca sizin ve işletmeniz için en uygun dijital pazarlama tekniklerini harekete geçirerek dijital dönüşümde markanızın öne çıkmasını sağlıyorum!
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-orange-500 to-red-500 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <Image src="/trend-tech-icon.png" alt="Trend Tech" width={40} height={40} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white transition-colors duration-300">Trend Teknolojiler</h3>
              <p className="text-xl font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Size en yenilikçi çözümleri sunmak için web tasarım ve dijital pazarlama trendleri ve teknolojilerinin ön saflarında yer alıyorum. Dijital pazarlama uzmanı olarak en garantili yolu hedefleyen uygulamaları ve araçları süreklilik halinde tutabilmek adına teknolojiden yararlanıyorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900" role="region" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-blue-600 font-black mb-6">
              <Image src="/services-icon.png" alt="Hizmetler ikonu" width={32} height={32} />
              <span className="text-2xl lg:text-3xl xl:text-4xl">Sunduklarım</span>
            </div>
            <h2 id="services-heading" className="text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-white mb-8">
              Profesyonel Hizmetlerim
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Dijital dünyada markanızı öne çıkaran, yaratıcı çözümlerle işinizi büyüten profesyonel hizmetlerim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Service Card 1: Web Tasarımı & Dijital Pazarlama Kreatifleri */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Image src="/web-design-icon.png" alt="Web Tasarımı" width={60} height={60} />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">Web Tasarımı&nbsp;& Dijital Pazarlama Kreatifleri</h3>
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 flex-grow font-black">
                Kalabalık bir pazarda öne çıkmak için güçlü bir web tasarımı ve dijital pazarlama stratejisi oluşturmak şarttır.
              </p>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8 w-full">
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Web Tasarımı&nbsp;& Geliştirme&nbsp;& Optimizasyon</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Dijital Pazarlama Kreatifleri</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Sosyal Medya Yönetimi</span>
                </li>
              </ul>
              <div className="flex space-x-4 w-full">
                <Link
                  href="https://wa.me/+905552677739"
                  className="flex-1 bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Randevu Al!
                </Link>
                <Link
                  href="/hizmetler/web-tasarim"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Detayları Gör &gt;
                </Link>
              </div>
            </div>

            {/* Service Card 2: Gelişim */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Image src="/development-icon.png" alt="Gelişim" width={60} height={60} loading="lazy" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">Gelişim</h3>
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 flex-grow font-black">
                Kalabalık bir pazarda öne çıkmak için güçlü bir marka kimliği ve dijital dönüşüm oluşturmak şarttır.
              </p>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8 w-full">
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Strateji&nbsp;Geliştirme&nbsp;& Uygulama&nbsp;& Optimizasyon</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Dijital Dönüşüm Rehberliği</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-green-500 dark:text-green-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Sürekli İyileştirme ve Analiz</span>
                </li>
              </ul>
              <div className="flex space-x-4 w-full">
                <Link
                  href="https://wa.me/+905552677739"
                  className="flex-1 bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Randevu Al!
                </Link>
                <Link
                  href="/hizmetler/gelisim"
                  className="flex-1 bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Detayları Gör &gt;
                </Link>
              </div>
            </div>

            {/* Service Card 3: Marka Kimliği */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Image src="/brand-identity-icon.png" alt="Marka Kimliği" width={60} height={60} />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">Marka Kimliği</h3>
              <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 flex-grow font-black">
                Kalabalık bir pazarda öne çıkmak için güçlü bir marka kimliği ve dijital dönüşüm oluşturmak şarttır.
              </p>
              <ul className="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-8 w-full">
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Logo Tasarımı&nbsp;& Tutarlı Renk Paletleri&nbsp;& Marka Yönergeleri</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Marka Kimliği Reklamları</span>
                </li>
                <li className="flex items-start text-lg">
                  <svg className="w-5 h-5 text-orange-500 dark:text-orange-400 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span>Marka Tanınırlığı İçin Platform Yayınları</span>
                </li>
              </ul>
              <div className="flex space-x-4 w-full">
                <Link
                  href="https://wa.me/+905552677739"
                  className="flex-1 bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Randevu Al!
                </Link>
                <Link
                  href="/hizmetler/marka-kimligi"
                  className="flex-1 bg-orange-700 hover:bg-orange-800 text-white text-center py-3 rounded-lg font-black transition-colors"
                >
                  Detayları Gör &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Seçilebilir Çalışmalarım
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-600 font-black mb-8">
              Tasarım Harikalarıyla Dijital Pazarlama ile Markanızı ve Sizi Yükseltmek!
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Portfolio Item 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image src="/digital-marketing-icon.png" alt="Dijital Pazarlama" width={60} height={60} className="mr-4" />
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">Dijital Pazarlama</h4>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Siz ve İşletmeniz İçin Öncü Olma Zamanı Meta Ads & Google Ads & Tiktok & LinkedIn platformlarında sürdürülebilir stratejiler ile mükemmel sonuçları almanızı sağlıyorum! Aylık ve Yıllık Ödeme planları ile İndirimli avantajlar sizleri bekliyor!
                </p>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Portfolio Item 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image src="/web-design-icon.png" alt="WordPress Web Tasarımı" width={60} height={60} className="mr-4" />
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">WordPress Web Tasarımı</h4>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Siz ve Markanız İçin İster Kişisel, İsterseniz E-Ticaret Web Tasarım Çözümleri ile Yanınızdayım! Daha Kapsamlı E-ticaret kreatifleri için ise İkas, Ticimax, Digi gibi kendi alanlarında lider markalar ile çalışmanızı sağlıyorum.
                </p>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Portfolio Item 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image src="/digital-transformation-icon.png" alt="Dijital Dönüşüm" width={60} height={60} className="mr-4" />
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">Dijital Dönüşüm ve Süreklilik!</h4>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Dijital dönüşüm çağında sürdürülebilir stratejiler ile daima sizin için en uygun seçenekleri sunarak markanızın öncü tanınır olmasını sağlıyorum. En az iki platformda markanızın reklamını en iyi kreatifler ile 7/24 canlı olarak yayınlıyorum!
                </p>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>

            {/* Portfolio Item 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <Image src="/brand-identity-icon.png" alt="Marka Kimliği" width={60} height={60} className="mr-4" />
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white">Sizin İçin Markanızı Oluşturalım!</h4>
                </div>
                <p className="text-lg text-gray-800 dark:text-gray-200 mb-6 leading-tight font-black">
                  Siz yada markanız için en iyi kurumsal tasarımlar ile lider olmanızı sağlıyorum. Her adım verimliliğe aşıktır.
                </p>
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-black transition-colors"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={20} height={20} className="mr-2" />
                  Randevu Al
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projeler"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-700 dark:to-gray-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-gray-800 dark:hover:to-gray-900 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Tüm Çalışmalarıma Göz Atın!
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Benim Sürecim
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-600 font-black mb-8">
              Yaratıcı İş Akışım
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <span className="text-white font-black text-2xl">1</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-gray-900 dark:text-white transition-colors duration-300">Keşif</h4>
              <p className="text-lg font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Markanızı, hedeflerinizi ve hedef kitlenizi derinlemesine anlamak için derinlemesine araştırmalar yapıyorum. Detaylı danışmanlık ve araştırmalar yoluyla, tüm tasarım yada dijital dönüşüm sürecini bilgilendiren temel iç görüler topluyorum.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-green-500 to-green-600 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <span className="text-white font-black text-2xl">2</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-gray-900 dark:text-white transition-colors duration-300">Tasarım</h4>
              <p className="text-lg font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Görsel olarak etkileyici ve stratejik tasarımlar oluşturmaya başlıyorum. Bu adım, fikirleri markanızla uyumlu, somut görsel konseptlere dönüştürmeye odaklanıyor. Bu görseller kişisel seçimlerinize kreatif çeşitlilik barındırıyor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <span className="text-white font-black text-2xl">3</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-gray-900 dark:text-white transition-colors duration-300">Geliştirme</h4>
              <p className="text-lg font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Görselleri tamamen işlevsel bir web sitesine yada seçmiş olduğunuz dijital pazarlama araçlarına dönüştürüyorum. Bu aşama, sitenizin yada dijital pazarlama araçlarınızın tüm cihazlarda ve platformlarda sorunsuz bir şekilde çalışmasını sağlamak için titiz bir kodlama süreci içerir.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-gray-600 dark:to-gray-700 shadow-md">
                <span className="text-white font-black text-2xl">4</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-gray-900 dark:text-white transition-colors duration-300">Başlatma</h4>
              <p className="text-lg font-black leading-tight text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Yayına girmeden önce her şeyin kusursuz çalıştığından emin olmak için web sitenizi yada dijital pazarlama uygulama ve araçlarını titizlikle test ediyorum. Lansman sonrasında ise, yeni çevrimiçi varlığınızı en üst düzeye çıkarmanıza yardımcı olmak için destek ve rehberlik sağlıyorum.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="https://wa.me/+905552677739"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 dark:from-gray-700 dark:to-gray-800 hover:from-green-700 hover:to-green-800 dark:hover:from-gray-800 dark:hover:to-gray-900 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Randevu Planlayın!
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Hakkımda
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-200 font-black mb-8">
              Tasarım Ve Dijital Dönüşüm Yolculuğumu Keşfedin
            </h3>
          </div>
          
          {/* About Content with Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Content - Photo */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <Image
                  src="/okan-about-photo.webp"
                  alt="Okan Demir"
                  width={768}
                  height={894}
                  className="rounded-2xl shadow-2xl w-full h-auto object-contain max-w-md hover:shadow-3xl transition-shadow duration-300"
                />
              </div>
            </div>
            
            {/* Right Content - Text */}
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-xl lg:text-2xl text-blue-100 leading-tight font-black">
                Merhaba! Ben Okan Demir, görsel olarak çekici, kullanıcı dostu web siteleri ve markanız ile sizin için dijital pazarlama ihtiyaçlarınız konusunda 5 yılı aşkın deneyime sahip, tutkulu bir uzmanım. Misyonum, benzersiz ihtiyaçlarınıza göre uyarlanmış yenilikçi tasarım ve reklam kreatif çözümleriyle markanızı hayata geçirmek.
              </p>
              <p className="text-lg text-blue-200 leading-tight font-black">
                Vizyonum O Copyright Dijital Pazarlama & Yazılım Freelancer markasını şahıs şirketine dönüştürerek ülkemiz içerisinde istihdam yaratarak genç işsizliği azaltmak ve ülkemiz içerisinde güvenilirliğini ispatlamış lider bir şirket markası yaratmaktır!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Stat 1 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">05+</div>
                <h4 className="text-2xl font-black mb-4">Yılların Deneyimi</h4>
                <p className="text-lg text-blue-100">
                  Olağanüstü projeler ve kreatif çözümler sunmada onlarca yıllık deneyim.
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">50+</div>
                <h4 className="text-2xl font-black mb-4">Teslim Edilen Projeler</h4>
                <p className="text-lg text-blue-100">
                  Olağanüstü projeler teslim etmede onlarca yıllık deneyim.
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-500 ease-out">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="text-5xl lg:text-6xl font-black text-yellow-400 mb-4">98%</div>
                <h4 className="text-2xl font-black mb-4">Müşteri Memnuniyeti</h4>
                <p className="text-lg text-blue-100">
                  Kanıtlanmış sonuçlarla uzun vadeli ortalıklar kuruyorum. Memnuniyet mükemmelliktir!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-2xl lg:text-3xl font-black mb-8">Başarı Hikayelerim</h4>
            <p className="text-xl text-blue-100 leading-tight max-w-4xl mx-auto">
              Hırslı girişimlerden köklü şirketlere ve markalara kadar çeşitli müşterilerle işbirliği yapmaktan gurur duyuyorum. Diğer başarı hikayem neden sizinle olmasın?
            </p>
          </div>
        </div>
      </section>

      {/* Custom Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Özel Fiyatlandırma
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-600 font-black mb-8">
              İhtiyacınıza Özel Çözümler
            </h3>
            <p className="text-xl text-gray-800 dark:text-gray-200 leading-tight max-w-3xl mx-auto font-black">
              Her proje benzersizdir. Size en uygun çözümü sunmak için ihtiyaçlarınızı dinleyip, özel bir teklif hazırlıyorum. 
              Birlikte çalışarak en verimli ve ekonomik çözümü bulalım.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 lg:p-12 text-center">
              <div className="mb-8">
                <h4 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-6">
                  Kişiye Özel Fiyatlandırma
                </h4>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-tight font-black mb-8">
                  Projenizin kapsamına, karmaşıklığına ve süresine göre size özel bir fiyat teklifi hazırlıyorum. 
                  İlk görüşmemizde ihtiyaçlarınızı detaylı olarak dinleyip, en uygun çözümü sunuyorum.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="text-left">
                  <h5 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Neler Dahil?</h5>
                  <ul className="space-y-3">
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Detaylı Proje Analizi
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Şeffaf Fiyat Teklifi
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Esnek Ödeme Seçenekleri
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Sürekli İletişim ve Destek
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h5 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Avantajlar</h5>
                  <ul className="space-y-3">
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Bütçenize Uygun Çözümler
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Özel İndirim Fırsatları
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Uzun Vadeli İş Birlikleri
                    </li>
                    <li className="flex items-center text-lg font-black text-gray-700">
                      <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Garantili Sonuçlar
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href="https://wa.me/+905552677739"
                  className="inline-flex items-center bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                  Ücretsiz Görüşme Talep Et
                </Link>
                <Link
                  href="mailto:info@okandemir.org"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                  Email ile İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-700 leading-tight max-w-3xl mx-auto font-black">
              Dijital pazarlama ve web tasarım hizmetlerim hakkında merak ettiğiniz soruların yanıtları.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Web sitesi tasarım süreci ne kadar sürer?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                Temel web sitesi tasarımı 1-2 hafta, e-ticaret sitesi 3-4 hafta sürer. Süreç, projenin karmaşıklığına ve müşterinin geri bildirim hızına bağlıdır.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Dijital pazarlama kampanyalarında hangi platformları kullanıyorsunuz?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                Google Ads, Meta (Facebook/Instagram) Ads, TikTok Ads, LinkedIn Ads ve sosyal medya platformlarında kampanyalar yürütüyorum.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                SEO sonuçları ne zaman görülür?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                SEO sonuçları genellikle 3-6 ay içinde görülmeye başlar. İlk aylarda teknik optimizasyon, sonrasında içerik ve link çalışmaları devam eder.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Hangi ödeme seçenekleri mevcut?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                Aylık, 3 aylık ve yıllık ödeme seçenekleri sunuyorum. Yıllık ödemelerde %20 indirim uygulanır.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Proje teslim sonrası destek veriyor musunuz?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                Evet, tüm projelerim için 30 gün ücretsiz destek veriyorum. Sonrasında aylık bakım paketleri mevcuttur.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                Web sitesi tasarımında hangi teknolojileri kullanıyorsunuz?
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-tight font-black">
                WordPress, Next.js, React, HTML5, CSS3, JavaScript ve modern web teknolojilerini kullanarak responsive ve hızlı siteler tasarlıyorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Aklınızda Bir Proje Var mı?
            </h2>
            <h3 className="text-2xl lg:text-3xl text-blue-400 font-black mb-8">
              Fikirlerinizi Gerçeğe Dönüştürelim
            </h3>
              <p className="text-xl lg:text-2xl text-gray-200 leading-tight max-w-3xl mx-auto mb-12 font-black">
              Hayalinizdeki projeyi hayata geçirmek için benimle iletişime geçin. Dijital dünyada markanızı zirveye taşıyacak yaratıcı çözümler sunmaya hazırım!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="mailto:info@okandemir.org"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/email-icon.png" alt="Email" width={24} height={24} className="mr-3" />
                Email Gönder
              </Link>
              <Link
                href="https://wa.me/+905552677739"
                className="inline-flex items-center bg-green-700 hover:bg-green-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-8 py-4 rounded-full font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Image src="/whatsapp-icon.png" alt="WhatsApp" width={24} height={24} className="mr-3" />
                WhatsApp İletişim
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              Dijital Pazarlama İpuçları
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 leading-tight mb-8 font-black">
              Dijital pazarlama dünyasındaki en güncel trendler, ipuçları ve stratejiler için e-bültenimize abone olun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-gray-500 w-full"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-black text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                Abone Ol
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
    </div>
      </section>
    </>
  );
}
