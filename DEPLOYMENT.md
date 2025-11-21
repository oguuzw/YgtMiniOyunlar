# 🚀 YGT Mini Games - Deployment Rehberi

Bu dosya AI vs Gerçek oyununu canlıya almak için adım adım talimatlar içerir.

## 📋 Deployment Seçenekleri

### ✅ 1. VERCEL (ÖNERİLEN - Tamamen Ücretsiz)

**Avantajları:**
- ✅ Tamamen ücretsiz
- ✅ Hem backend hem frontend tek yerde
- ✅ Otomatik SSL (HTTPS)
- ✅ Global CDN
- ✅ Git push ile otomatik deploy

**Adımlar:**

#### A. Vercel Hesabı ve CLI Kurulumu
```bash
# 1. https://vercel.com adresine gidin
# 2. GitHub hesabınızla giriş yapın
# 3. Vercel CLI'yi yükleyin
npm install -g vercel
```

#### B. Projeyi Deploy Etme
```bash
# Proje kök dizininde
vercel

# İlk deploy için sorular:
# - Set up and deploy? → Y
# - Which scope? → (hesabınızı seçin)
# - Link to existing project? → N
# - Project name? → ygt-mini-games
# - Directory? → ./ (Enter)
# - Override settings? → N
```

#### C. Production Deploy
```bash
vercel --prod
```

**Sonuç:** Site `https://ygt-mini-games.vercel.app` gibi bir URL'de yayında olacak!

---

### 🌟 2. NETLIFY (Alternatif - Ücretsiz)

**Adımlar:**

1. https://netlify.com → "New site from Git"
2. GitHub repository'nizi bağlayın
3. Build ayarları:
   - **Build command:** `cd server && npm install`
   - **Publish directory:** `docs`
   - **Functions directory:** `server`

4. Deploy butonuna basın

**Not:** Netlify Functions backend için kullanılır.

---

### 🔥 3. GITHUB PAGES + RENDER (Backend Ayrı)

#### Frontend (GitHub Pages):
```bash
# 1. GitHub repo settings → Pages
# 2. Source: Deploy from a branch
# 3. Branch: main, folder: /docs
# 4. Save
```

#### Backend (Render):
1. https://render.com → New Web Service
2. GitHub repo'nuzu bağlayın
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Create Web Service

**Sonra:** `docs/scripts/ai-vs-real.js` içinde API_URL'i Render URL'ine güncelleyin.

---

## 🔧 Deployment Sonrası Kontroller

### ✅ Kontrol Listesi:
- [ ] Site açılıyor mu?
- [ ] Backend çalışıyor mu? (`/api/generate-pair`)
- [ ] Görseller yükleniyor mu?
- [ ] Yeni tur butonu çalışıyor mu?
- [ ] Sonuç modal'ı görünüyor mu?
- [ ] HTTPS aktif mi?

### 🐛 Sorun Giderme:

**"API isteği başarısız" hatası:**
- Vercel logs kontrol edin: `vercel logs`
- Backend URL'ini kontrol edin
- CORS ayarlarını kontrol edin

**Görseller yüklenmiyor:**
- Tarayıcı console'u kontrol edin (F12)
- Network tab'de istekleri kontrol edin
- Pollinations.ai servisinin çalıştığını kontrol edin

**Cache çalışmıyor:**
- Sunucu loglarını kontrol edin
- Vercel serverless function timeout ayarını kontrol edin

---

## 📊 Performans İyileştirmeleri

### Vercel için:
```json
// vercel.json içine ekleyin
{
  "functions": {
    "server/server.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### CDN Cache:
- Statik dosyalar (CSS, JS, resimler) otomatik cache'lenir
- API endpoint'leri cache'lenmez (dinamik içerik)

---

## 🔐 Güvenlik

**Production'da yapılması gerekenler:**
- [ ] CORS sadece kendi domain'inize izin verin
- [ ] Rate limiting ekleyin (DDoS koruması)
- [ ] Error mesajlarında detay vermeyin
- [ ] HTTPS kullanın (Vercel otomatik sağlıyor)

---

## 📈 Monitoring

**Vercel Dashboard:**
- Analytics: Ziyaretçi sayısı
- Logs: Hata logları
- Performance: Yükleme süreleri

**Ücretsiz Monitoring Araçları:**
- Google Analytics (ziyaretçi takibi)
- Sentry.io (hata takibi)
- UptimeRobot (uptime monitoring)

---

## 🎉 Başarılı Deploy Sonrası

Site canlıya alındıktan sonra:
1. URL'i README.md'ye ekleyin
2. GitHub About bölümüne URL ekleyin
3. Sosyal medyada paylaşın
4. YGT topluluğuna duyurun

**Örnek URL Yapısı:**
- Ana site: `https://ygt-mini-oyunlar.vercel.app`
- AI vs Real: `https://ygt-mini-oyunlar.vercel.app/ai-vs-real.html`

---

## 💡 İpuçları

1. **Hızlı Test:** `vercel dev` komutu ile local'de production gibi test edin
2. **Otomatik Deploy:** GitHub'a push atınca otomatik deploy olur
3. **Rollback:** Vercel dashboard'dan eski versiyona dönebilirsiniz
4. **Custom Domain:** Kendi domain'inizi bağlayabilirsiniz (ücretsiz)

---

## 📞 Yardım

Sorun yaşarsanız:
- Vercel Docs: https://vercel.com/docs
- Discord: YGT Discord kanalı
- GitHub Issues: Repo'da issue açın
