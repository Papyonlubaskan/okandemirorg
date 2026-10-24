# okandemir.org — Cursor Proje Brifingi ve Uygulama Yol Haritası

Amaç: Bu dosyayı Cursor'da proje bağlamı olarak kullan. Önce mevcut depoyu incelet; sonra küçük, test edilebilir adımlarla uygulat. Bu belge bir mimari öneridir; mevcut kaynak kodunun tamamının denetlendiği veya önerilen dosyaların zaten var olduğu anlamına gelmez.

## 1. Proje vizyonu

okandemir.org, Railway üzerinde çalışan Next.js tabanlı, çok müşterili bir SaaS platformuna dönüşecek. Kullanıcılar yapay zekâ ajanları aracılığıyla kendi web sitelerini oluşturabilecek; sonraki aşamalarda SEO, içerik ve dijital pazarlama süreçlerini tek panelden yönetebilecek.

Uzun vadeli hedef, ikas/Ticimax benzeri işletme platformu yönünde ilerlemek: site oluşturma, entegrasyonlar, pazarlama araçları ve otomasyonlar. Ürün olabildiğince kendi kendine çalışmalı; ancak riskli işlemler için kullanıcı onayı zorunlu olmalı.

İş hedefi:

- Başlangıç sermayesi çok sınırlı.
- Maliyetlerin mümkün olduğunca düşük tutulması gerekiyor.
- Önce gerçek müşterinin para ödeyeceği tek bir işlevi doğrula; sonra özellik ekle.
- Gelir, maliyet ve müşteri başına kullanım ölçülmeden büyük reklam harcaması veya büyük altyapı yatırımı yapma.
- Pasif gelir bir hedef olabilir, fakat bakım, müşteri desteği, sağlayıcı değişiklikleri ve güvenlik nedeniyle tamamen müdahalesiz gelir garanti edilemez. (Müdahaleyi biz yapacağız!)

## 2. Kullanıcının belirttiği mevcut ortam

- GitHub deposu: https://github.com/Papyonlubaskan/okandemirorg.git
- Canlı alan adı: https://okandemir.org
- Hosting / uygulama: Railway
- Web teknolojisi: Next.js 15, TypeScript, React, Tailwind CSS
- Veritabanı: Railway üzerinde MySQL (mysql2)
- Projede `app/`, `lib/`, `database/`, `__tests__/` ve `n8n/` klasörleri var; Cursor önce gerçek dizin ağacını ve dosyaları doğrulamalı.
- Kullanıcının bilgisayarında LLM çalıştırılması istenmiyor. Modeller uzak sağlayıcıların API'leri üzerinden kullanılacak.
- Mevcut Next.js ve MySQL altyapısını koru; gereksiz yere baştan yazma.
- `n8n/` dosyalarını koru; mevcut akışları incelemeden silme veya değiştirme.

## 3. Temel AI yaklaşımı: uzman ajan ekibi

Tek bir modele bütün işleri yaptırmak yerine, bir ana orkestratör uzman ajanları ve araçları yönetecek.

Olası uzmanlıklar: istek sınıflandırma ve planlama; web sitesi oluşturma / kodlama; tasarım ve içerik; SEO ve araştırma; görsel / video üretimi; kod ve çıktı kalite kontrolü; dijital pazarlama analizi; ileride Google Ads, Meta, TikTok, LinkedIn ve ilgili e-ticaret/işe alım entegrasyonları.

Ana orkestratör sınırsız serbest döngüde çalışan bir LLM olmamalı. Modelden yapılandırılmış plan almalı; izinli araçları, bütçeleri ve durum geçişlerini normal TypeScript kodu kontrol etmeli.

## 4. Model yönlendirme ve maliyet stratejisi

Öncelik: ücretsiz kotası olan veya düşük maliyetli uzak API modelleri. Ücretli, daha güçlü model sadece gereken durumlarda kalite denetimi / zor hata çözümü için kullanılacak.

Kısıtlar:

- "Açık model" olmak, her sağlayıcıda ücretsiz veya sınırsız API erişimi olduğu anlamına gelmez.
- Ücretsiz kota, hız sınırı, ticari kullanım koşulları ve model yetenekleri sağlayıcı ve zaman bazında değişir.
- Kotası doğrulanmayan sağlayıcı unlimited olarak işaretlenmemeli; unknown olarak tutulmalı.
- Ücretsiz kota bitince ücretli modele otomatik geçiş ancak workspace/uygulama bütçesi ve izinli politika uygunsa yapılmalı. Aksi halde görev beklemeli veya anlaşılır hata vermeli.
- Birinci sağlayıcı hatasında sınırlı tekrar deneme ve uygun alternatif sağlayıcı kullanılabilir.
- Tekrarlayan başarısızlıkta önce kodla doğrulama / basit düzeltme; sonra alternatif ücretsiz model; en son, bütçe varsa ücretli kalite modeli.
- Her model çağrısında sağlayıcı, model, görev türü, süre, token bilgisi (varsa), tahmini maliyet ve sonuç kaydedilmeli.
- Kullanıcı API anahtarları veya sağlayıcı sırları tarayıcıya gönderilmemeli.

Potansiyel sağlayıcılar: NVIDIA API Catalog, Hugging Face Inference Providers ve uygun başka API servisleri. Her biri için güncel şartlar, kota ve ticari kullanım koşulları uygulamadan önce resmi belgelerden doğrulanmalı. Görsel/video üretimi ayrı yetenek arayüzleri isteyebilir; metin modeli arayüzünü her modaliteye zorla uygulama.

## 5. İlk teslimat: ana orkestratör MVP

1. Kullanıcı görev gönderir.
2. Kimlik doğrulama ve workspace yetkisi doğrulanır.
3. Kota / bütçe kontrolü yapılır.
4. Görev MySQL'e kalıcı olarak yazılır.
5. Orkestratör görevi sınıflandırır ve yapılandırılmış plan oluşturur.
6. Plan şema ve izin listesiyle doğrulanır.
7. İzinli tek araç çalıştırılır.
8. Sonuç ve model çağrısı metrikleri kaydedilir.
9. Kullanıcı görev durumunu ve sonucunu görür.
10. Hatalar kontrollü ve denetlenebilir biçimde sonuçlanır.

İlk prototip gerçek reklam kampanyası açmamalı veya siteyi herkese açık yayınlamamalı. Önce güvenli, etkisiz bir test göreviyle uçtan uca işleyiş doğrulanmalı.

## 6. Önerilen mimari

- Mevcut Next.js App Router / Route Handlers: API ve kullanıcı arayüzü.
- Mevcut MySQL: görev durumu, adımlar, sağlayıcı çağrıları, kota ve onaylar.
- Provider-agnostic model geçidi.
- Ana orkestratör: plan üretme, araç seçimi, durum ve limit yönetimi.
- Allowlist araç kayıt sistemi.
- Kalıcı iş kuyruğu: DB tabanlı kuyruk ve worker. Next.js HTTP isteğinin içinde uzun süren görevin tamamlanacağı varsayılmamalı.
- Mevcut `n8n/`: zamanlanmış iş akışları / bildirimler / uygun harici entegrasyonlar; aynı kritik işin iki sistem tarafından kontrolsüz yürütülmesini engelle.
- Sonraki aşama: ayrı Railway worker servisi; gerekirse Redis ancak mevcut kullanım ve maliyet incelendikten sonra.
- Kullanıcı tarafından üretilen kod ana uygulama sürecinde çalıştırılmamalı. Build/preview/deploy için ayrı sandbox ve kaynak/ağ kısıtları gerekir.

## 7. Önerilen dosya planı

Gerçek, mevcut düzene uyarlanmış yollar için bkz. `.cursor/plans` altındaki onaylı plan ve `lib/ai/`, `lib/agents/`, `lib/jobs/`, `database/migrations/`.

Belgedeki öneriler: `lib/ai/types.ts`, `lib/ai/providers/{provider,nvidia,huggingface,openai-compatible}.ts`, `lib/ai/router.ts`, `lib/ai/fallback.ts`, `lib/agents/{orchestrator,registry,policies,validate-plan}.ts`, `lib/jobs/{queue,worker}.ts`, `lib/db/schema/{ai,agents}.ts` (projede SQL migration'a uyarlandı), `lib/security/secrets.ts`, `app/api/ai/tasks/route.ts`, `app/api/ai/tasks/[taskId]/route.ts`, `app/api/ai/approvals/[approvalId]/route.ts`, `app/api/ai/usage/route.ts`, `__tests__/ai/{router,orchestrator,approvals}.test.ts`.

Var olan auth, DB katmanı, logging, test altyapısı veya API isimleri tekrar icat edilmemeli.

## 8. MySQL veri modeli

Mevcut şema incelenmeden migration çalıştırma. Mevcut tabloları yeniden adlandırma veya silme; gerekiyorsa geriye dönük uyumlu ek migration yaz.

Mantıksal tablolar: `workspaces`, `workspace_members`, `ai_tasks`, `ai_task_steps`, `ai_model_calls`, `ai_approvals`, `provider_usage`, `audit_logs`.

İndeksler: `ai_tasks(workspace_id, status, created_at)`, `ai_task_steps(task_id, status)`, `ai_model_calls(task_id, created_at)`, `ai_approvals(workspace_id, status, expires_at)`, workspace kapsamlı benzersiz idempotency anahtarı.

Kritik kurallar:

- Workspace erişimi her istekte sunucu tarafında doğrulanır.
- Approval kaydı, onaylanan payload'ın hash'ini ve sürümünü bağlar. Payload değişirse onay geçersizdir.
- Aynı idempotency anahtarı aynı işlem için ikinci etkiyi yaratmaz.
- Token'lar ve sırlar açık metin kaydedilmez.
- Para miktarı için DECIMAL; sayaçlar için uygun integer türleri.
- Mevcut kullanıcı, tenant veya log tablolarının gereksiz kopyaları oluşturulmaz.

## 9. Görev durumları ve güvenilirlik

Durumlar: `queued`, `planning`, `running`, `awaiting_approval`, `retry_wait`, `succeeded`, `failed`, `cancelled`, `expired`.

Durum geçişleri izinli bir geçiş tablosuyla doğrulanmalı. Worker yeniden başladığında yarım kalmış işler kurtarılmalı; job lock/lease ve maksimum deneme sayısı tanımlanmalı. MySQL kuyruk tasarımı DB sürümüne uygun olmalı (`SKIP LOCKED` yoksa atomik kilitleme).

## 10. Kullanıcı onayı politikası

- Metin taslağı / SEO analizi / taslak üretimi: otomatik.
- Siteyi herkese açık yayımlama: onay gerekli.
- Reklam kampanyası oluşturma veya etkinleştirme: onay gerekli.
- Reklam bütçesi artırma: onay gerekli.
- OAuth bağlantısı ve izin verme: kullanıcının açık işlemi gerekli.
- Veri silme ve geri alınması zor eylemler: açık onay gerekli.

Onay ekranında işlem özeti, hedef platform/hesap, bütçe, tarih ve etkiler açıkça gösterilsin. Onay süreli olsun. Payload hash veya sürümü eşleşmiyorsa yeniden onay istenmeli. Sunucu onay sonrası yetkiyi ve bütçeyi yeniden doğrulamalı.

## 11. Güvenlik kontrol listesi

- Oturum ve workspace üyeliği her API çağrısında doğrulansın.
- İstemciden gelen userId / workspaceId tek başına yetki kanıtı sayılmasın.
- Araçlar allowlist ile sınırlansın; model üretimi fonksiyon/SQL/shell komutları çalıştırılmasın.
- SQL parametreli sorgular kullansın.
- Provider anahtarları yalnızca sunucuda; `NEXT_PUBLIC_` değişkenleri asla secret içermesin.
- OAuth token'ları uygun şifreleme ile saklansın; en dar izinler kullanılsın.
- Dış içerikler prompt injection'a karşı güvenilmeyen veri olarak ele alınsın.
- Kullanıcı kodu ana web sunucusunda çalıştırılmasın.
- Rate limit: kullanıcı, workspace, IP ve sağlayıcı bazında.
- Her görev için max adım, max model çağrısı, timeout, çıktı boyutu ve maliyet bütçesi.
- Hassas işlemler onaysız çalışmasın.
- Audit log'lar sırları ve gereksiz kişisel verileri içermesin.
- Üretim migration'ı öncesi yedek ve geri dönüş planı.

## 12. Test ve kabul kriterleri

Mevcut `package.json` komutları kullanılır (`type-check`, `lint:check`, `test`, `build`).

1. TypeScript kontrolü ve production build başarılı.
2. Model adaptörü doğru isteği gönderir; secret log'lanmaz.
3. Timeout / 429 / sağlayıcı hatası kontrollü fallback üretir.
4. Bilinmeyen kota sınırsız kabul edilmez.
5. Ücretli modele geçiş bütçe ve politika olmadan gerçekleşmez.
6. Model planı şemaya uymuyorsa araç çalıştırılmaz.
7. İzin listesinde olmayan araç çağrılamaz.
8. Bir workspace diğerinin görev/sonuç/onay kayıtlarını okuyamaz.
9. Onay yokken publish/ad harcama aracı çağrılamaz.
10. Payload değiştiğinde eski onay geçersiz kalır.
11. Idempotency aynı yan etkiyi iki kez üretmez.
12. Worker çökmesi sonrası iş güvenli biçimde kurtarılır.
13. Hata ve model çağrıları gözlemlenebilir şekilde kaydedilir.

Harici API testleri varsayılan olarak mock kullanır; CI'da gerçek model çağrısı veya ücretli işlem çalıştırılmaz.

## 13. Aşamalı teslimat planı

- Faz 0 — Repo keşfi (değişiklik yok).
- Faz 1 — Minimal güvenli orkestratör: provider adaptörü + mock, tek düşük riskli görev türü, MySQL kaydı, araç registry, plan doğrulama, maliyet/çağrı limitleri.
- Faz 2 — Kalıcı worker ve fallback: kuyruk güvenilirliği, timeout, retry, idempotency, alternatif sağlayıcılar, kullanım metrikleri.
- Faz 3 — Onay ve tenant güvenliği: workspace izolasyonu, onay kayıtları, payload hash, süre aşımı, audit log.
- Faz 4 — İkinci sağlayıcı ve kalite modeli: resmi şart/kota doğrulaması, ücretsiz öncelik, bütçeli ücretli fallback.
- Faz 5 — İlk uzman ajan: site taslağı/önizleme, onay sonrası güvenli yayın, ardından SEO ve pazarlama ajanları.

Her faz sonunda testler çalıştırılır; değişiklik özeti, eklenen dosyalar, kalan riskler ve gereken migration'lar raporlanır.

## 15. Değişmez ürün ilkeleri

1. Mevcut çalışan projeyi koru; gerekçesiz yeniden yazım yapma.
2. Önce çalışan, test edilebilir ve gelir üretme ihtimali olan küçük ürün.
3. Model seçiminde sağlayıcıdan bağımsızlık.
4. Ücretsiz model önce; ücretli model yalnızca kontrollü ihtiyaçta.
5. Kota ve bütçe sınırı her zaman var.
6. Model önerir; kod izinleri ve kritik işlemleri denetler.
7. Yayınlama ve reklam harcamaları kullanıcı onayı ister.
8. Çok müşterili veri izolasyonu ilk günden.
9. Her görev gözlemlenebilir, durdurulabilir ve yeniden denenebilir.
10. Özellik eklemeden önce mevcut dosyalar ve şema incelenir.
