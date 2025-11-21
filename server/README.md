# AI vs Gerçek - Backend Server

Node.js/Express proxy sunucusu - **Pollinations.ai** ile gerçek zamanlı AI görsel üretimi.

## ✨ Özellikler
- ✅ **Tamamen ücretsiz** - API key gerekmez!
- ✅ **Sınırsız kullanım** - rate limit yok
- ✅ **Hızlı** - 2-3 saniyede görsel üretimi
- ✅ **Kolay kurulum** - sadece npm install

## Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Sunucuyu Başlatın
```bash
npm start
```

Sunucu `http://localhost:3000` adresinde çalışacak.

## API Endpoint

### POST `/api/generate-pair`
Yeni bir AI görseli üretir ve rastgele bir gerçek görsel seçer.

**Response:**
```json
{
  "success": true,
  "leftImage": "https://...",
  "rightImage": "https://...",
  "aiPosition": "left"
}
```

### GET `/health`
Sunucu durumunu kontrol eder.

## Özelleştirme

### Gerçek Görsel Havuzunu Değiştirme
`server.js` dosyasındaki `realImagePool` dizisini düzenleyin:

```javascript
const realImagePool = [
  'https://images.unsplash.com/photo-xxxxx?w=512&h=512&fit=crop',
  // Kendi görsel URL'lerinizi ekleyin
];
```

### AI Prompt'larını Değiştirme
`server.js` dosyasındaki `aiPrompts` dizisini düzenleyin:

```javascript
const aiPrompts = [
  'A photorealistic portrait of a person smiling...',
  // Kendi prompt'larınızı ekleyin
];
```

## Geliştirme Modu

```bash
npm run dev
```

Dosya değişikliklerinde otomatik yeniden başlatır (Node.js 18.11.0+ gerektirir).

## Güvenlik Notları

- ⚠️ API anahtarınızı asla git'e commit etmeyin
- `.env` dosyası `.gitignore`'a eklenmiştir
- Production ortamında CORS ayarlarını güvenlik gereksinimlerinize göre yapılandırın
- Rate limiting eklemeyi düşünün (production için)

## Maliyet

**🎉 Tamamen ücretsiz!** Pollinations.ai kullanılıyor - API key veya ödeme gerekmez.

## Sorun Giderme

### "CORS hatası"
- Backend sunucusunun `http://localhost:3000` adresinde çalıştığından emin olun
- Frontend'in `http://localhost:8000` (veya başka port) üzerinden erişildiğinden emin olun

### "AI görsel üretimi başarısız"
- İnternet bağlantınızı kontrol edin
- Pollinations.ai servisinin çalıştığından emin olun (https://pollinations.ai)

### Görseller yüklenmiyor
- Tarayıcı console'unu kontrol edin (F12)
- Backend loglarını kontrol edin
