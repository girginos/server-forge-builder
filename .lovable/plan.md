

# Sepet Sistemi - Step by Step Teklif Akışı

## Genel Bakış
Mevcut tek sayfalık sepet/teklif formunu, 4 adımlı (stepper) bir akışa dönüştüreceğiz. Teklif talepleri veritabanına kaydedilecek ve admin panelden görülebilecek. Giriş yapmamış kullanıcılar da teklif gönderebilecek.

## Adımlar

### 1. Veritabanı: `quote_requests` tablosu oluştur
Yeni bir tablo oluşturacağız (mevcut `orders` tablosundan ayrı, çünkü bu bir teklif talebi):

```sql
CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,  -- nullable (misafir)
  items jsonb NOT NULL DEFAULT '[]',
  total_amount numeric NOT NULL DEFAULT 0,
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  city text,
  tax_office text,
  tax_number text,
  billing_type text DEFAULT 'individual',  -- individual / corporate
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Herkes insert yapabilsin (misafir dahil)
CREATE POLICY "Anyone can create quotes" ON public.quote_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Kullanıcılar kendi taleplerini görsün
CREATE POLICY "Users view own quotes" ON public.quote_requests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admin her şeyi görsün ve güncellesin
CREATE POLICY "Admins manage quotes" ON public.quote_requests
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
```

### 2. Cart.tsx → 4 Adımlı Stepper UI
Mevcut `Cart.tsx` dosyasını tamamen yeniden yazacağız:

```text
Step 1: Sepet Özeti       → Ürün listesi, miktar, toplam
Step 2: İletişim Bilgileri → Ad, Firma, E-posta, Telefon
Step 3: Adres / Fatura    → Bireysel/Kurumsal seçimi, adres, vergi bilgileri
Step 4: Onay & Gönder     → Tüm bilgilerin özeti, gönder butonu
```

- Üstte progress bar / stepper göstergesi
- Her adımda "İleri" ve "Geri" butonları
- Son adımda tüm bilgiler özetlenir ve DB'ye insert yapılır
- Giriş yapılmışsa profil bilgileri otomatik doldurulur
- Zod validasyonu her adımda uygulanır

### 3. Admin Panele "Teklif Talepleri" Bölümü
- `AdminOrders.tsx` yanına `AdminQuotes.tsx` eklenecek
- Sidebar'a yeni menü linki
- Tablo: tarih, müşteri adı, e-posta, tutar, durum
- Durum güncelleyebilme (pending → reviewed → quoted → accepted → rejected)

### 4. Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| `supabase/migrations/...` | `quote_requests` tablosu + RLS |
| `src/pages/Cart.tsx` | Tamamen yeniden: 4 adımlı stepper |
| `src/pages/admin/AdminQuotes.tsx` | Yeni: Teklif talepleri yönetimi |
| `src/pages/admin/AdminLayout.tsx` | Sidebar'a "Teklifler" linki ekle |
| `src/App.tsx` | Admin route'a `/admin/teklifler` ekle |

### 5. Sepet Kalıcılığı
- `CartContext`'e `localStorage` desteği eklenecek (sayfa yenilemede kaybolmasın)

