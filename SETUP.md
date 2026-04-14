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

## Adım 6 — Vercel'e Environment Variables Ekle

1. https://vercel.com → `stoaix-website` projesi → **Settings** → **Environment Variables**
2. Şu üç değişkeni ekle (Production + Preview + Development seç):

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Adım 4'ten aldığın URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Adım 4'ten aldığın service role key |
| `JWT_SECRET` | Adım 5'te ürettiğin string |

3. Her birini ekledikten sonra **Save** bas
4. **Deployments** sekmesine git → en son deployment → **Redeploy** yap (env vars'ın geçmesi için)

---

## Adım 7 — Test Et

Redeploy tamamlandıktan sonra:

### 7a. Partner kaydı
1. `stoaix.com/partners/apply` adresine git
2. Form doldur (Standard plan seç), submit et
3. Dashboard'a yönlenmeli, referral link görünmeli

### 7b. Referral tracking
1. `stoaix.com/ref/[oluşan-slug]` adresine git (ör: `stoaix.com/ref/jane-smith`)
2. Ana sayfaya yönlenmeli
3. Browser'da DevTools → Application → Cookies → `stoaix_ref` cookie'sinin set edildiğini doğrula

### 7c. Admin paneli
1. `stoaix.com/admin/affiliates` adresine git
2. Adım 3'te belirlediğin şifreyi gir
3. Test ettiğin partner kayıtlı görünmeli

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

---

## Sonraki Adım (Ata ile konuşulacak)

- Stripe webhook → komisyon otomatik hesaplama (`invoice.paid` event)
- Referral cookie'yi checkout sayfasında okuyup müşteriyi affiliate'e bağlama

---

Sorularını Ata'ya ilet.
