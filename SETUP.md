# Affiliate Portal — Kurulum Talimatları

**Hazırlayan:** Jarvis / Ata  
**Hedef:** Bu adımlar tamamlandığında affiliate kayıt, dashboard ve admin paneli canlıda çalışır.

---

## Genel Bakış

Yapılan şeyler (kod tarafı tamam, sadece altyapı kurulumu gerekiyor):

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Partner kayıt | `/partners/apply` | Form → anında hesap + link |
| Partner dashboard | `/partner/dashboard` | Link, stats, komisyonlar |
| Admin paneli | `/admin/affiliates` | Affiliate listesi, komisyon onaylama |
| Referral tracker | `/ref/:slug` | Cookie set eder, tıklamayı loglar |

---

## Adım 1 — Supabase Projesi Aç

1. https://supabase.com adresine git, giriş yap
2. **New Project** → proje adı: `stoaix-affiliate`, şifre belirle, region: **Europe (Frankfurt)**
3. Proje açıldıktan sonra devam et

---

## Adım 2 — Veritabanı Şemasını Kur

1. Supabase sol menüde **SQL Editor** → **New query**
2. `supabase/schema.sql` dosyasının içeriğini yapıştır → **Run**
3. Sol menü **Table Editor**'da şu tabloların oluştuğunu doğrula:
   - `affiliates`
   - `affiliate_referrals`
   - `affiliate_commissions`
   - `affiliate_payouts`

---

## Adım 3 — Admin Hesabı Oluştur

SQL Editor'da aşağıdaki sorguyu çalıştır.  
`BURAYA_GUCLU_SIFRE_YAZ` kısmını gerçek bir şifreyle değiştir (not et, kaybet):

```sql
INSERT INTO affiliates (slug, name, email, password_hash, plan, tier, status, is_admin)
VALUES (
  'stoaix-admin',
  'STOAIX Admin',
  'admin@stoaix.com',
  crypt('BURAYA_GUCLU_SIFRE_YAZ', gen_salt('bf')),
  'standard',
  'starter',
  'active',
  true
);
```

> **Not:** Eğer `crypt` fonksiyonu çalışmazsa aşağıdaki adımı izle:
> 1. SQL Editor'da `CREATE EXTENSION IF NOT EXISTS pgcrypto;` çalıştır
> 2. Sonra yukarıdaki INSERT'i tekrar çalıştır

---

## Adım 4 — Supabase API Bilgilerini Al

Supabase → **Project Settings** → **API** bölümünden:

| Bilgi | Nerede bulunur |
|-------|----------------|
| `SUPABASE_URL` | "Project URL" alanı |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" → "secret" (reveal et) |

Bu ikisini bir yere not et, bir sonraki adımda lazım.

---

## Adım 5 — JWT Secret Üret

Terminalde şu komutu çalıştır, çıkan değeri not al:

```bash
openssl rand -base64 32
```

Yoksa şu siteyi kullan: https://generate-secret.vercel.app/32

---

## Adım 6 — Stripe API Keys Al

1. https://dashboard.stripe.com adresine git
2. Sol menü → **Developers** → **API keys**
3. **Secret key** alanındaki değeri kopyala ve not al (bu `STRIPE_SECRET_KEY`)

---

## Adım 7 — Stripe Webhook Oluştur

1. Stripe dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL:** `https://stoaix.com/api/webhooks/stripe`
3. **Events to send:**
   - `checkout.session.completed`
   - `invoice.paid`
4. **Add endpoint** butonuna bas
5. Oluşturulan webhook satırına tıkla → **Signing secret** → **Reveal** → kopyala (bu `STRIPE_WEBHOOK_SECRET`)

---

## Adım 8 — Vercel'e Environment Variables Ekle

1. https://vercel.com → `stoaix-website` projesi → **Settings** → **Environment Variables**
2. Şu altı değişkeni ekle (Production + Preview + Development seç):

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Adım 4'ten aldığın URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Adım 4'ten aldığın service role key |
| `JWT_SECRET` | Adım 5'te ürettiğin string |
| `STRIPE_SECRET_KEY` | Adım 6'dan aldığın Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Adım 7'den aldığın webhook signing secret |
| `SITE_URL` | `https://stoaix.com` |

3. Her birini ekledikten sonra **Save** bas
4. **Deployments** sekmesine git → en son deployment → **Redeploy** yap (env vars'ın geçmesi için)

---

## Adım 9 — Test Et

Redeploy tamamlandıktan sonra:

### 9a. Partner kaydı
1. `stoaix.com/partners/apply` adresine git
2. Form doldur (Standard plan seç), submit et
3. Dashboard'a yönlenmeli, referral link görünmeli

### 9b. Referral tracking
1. `stoaix.com/ref/[oluşan-slug]` adresine git (ör: `stoaix.com/ref/jane-smith`)
2. Ana sayfaya yönlenmeli
3. Browser'da DevTools → Application → Cookies → `stoaix_ref` cookie'sinin set edildiğini doğrula

### 9c. Admin paneli
1. `stoaix.com/admin/affiliates` adresine git
2. Adım 3'te belirlediğin şifreyi gir
3. Test ettiğin partner kayıtlı görünmeli

### 9d. Stripe checkout (opsiyonel test)
1. Stripe dashboard → **Developers** → **API keys** → **Test mode** açık olduğundan emin ol
2. `stoaix.com/checkout?plan=lite` adresine git
3. **Subscribe Now** butonuna tıkla → Stripe Checkout sayfasına yönlenmeli
4. Test kartı ile ödeme tamamla: `4242 4242 4242 4242`, herhangi son tarih, herhangi CVC
5. Stripe dashboard → **Webhooks** → webhook satırına tıkla → **Recent deliveries** → `checkout.session.completed` event'inin başarılı olduğunu doğrula
6. Supabase → `affiliate_referrals` tablosunda `converted_at` dolu bir kayıt görmeli (eğer referral cookie set edilmişse)

---

## Olası Sorunlar

**API 500 hatası verirse:**
- Vercel → Deployments → ilgili deployment → **Functions** sekmesinde log'lara bak
- Büyük ihtimalle env var eksik veya yanlış

**Admin girişi çalışmıyorsa:**
- `crypt()` ile şifre hash'lenmiş olmalı, düz metin değil
- Adım 3'teki SQL'de `pgcrypto` extension'ının kurulu olduğundan emin ol

**`stoaix_ref` cookie set edilmiyorsa:**
- `vercel.json`'daki rewrite kuralını kontrol et: `/ref/:slug` → `/api/ref`

**Stripe Checkout yönlendirme çalışmıyorsa:**
- Vercel Functions log'larında `/api/checkout/create-session` hatasına bak
- `STRIPE_SECRET_KEY` env var'ın doğru olduğundan emin ol
- Checkout sayfasında plan parametresinin URL'de olduğundan emin ol (ör: `?plan=lite`)

**Stripe webhook 400 veriyorsa:**
- `STRIPE_WEBHOOK_SECRET` değerinin Stripe dashboard'daki **Signing secret** ile birebir aynı olduğunu kontrol et
- Webhook endpoint URL'inin `https://stoaix.com/api/webhooks/stripe` olduğunu doğrula
- Vercel'de `/api/webhooks/stripe` fonksiyonunun deploy edildiğini kontrol et

**Komisyon oluşmuyorsa:**
- Supabase → `affiliate_referrals` tablosunda müşterinin `customer_id` ile kaydı var mı bak
- Stripe → `invoice.paid` event'i webhook'a ulaştı mı kontrol et (Recent deliveries)

---

Sorularını Ata'ya ilet.
