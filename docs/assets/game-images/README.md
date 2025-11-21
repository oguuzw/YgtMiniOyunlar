# AI vs Gerçek - Görsel Klasörü

Bu klasöre AI ve gerçek görselleri ekleyebilirsiniz.

## Kullanım
1. `ai/` ve `real/` alt klasörleri oluşturun (isteğe bağlı).
2. AI ve gerçek görselleri ekleyin (örn: `ai-1.jpg`, `real-1.jpg`).
3. `docs/scripts/ai-vs-real.js` dosyasındaki `aiImages` ve `realImages` dizilerini güncelleyin:

```javascript
const aiImages = [
  'assets/game-images/ai-1.jpg',
  'assets/game-images/ai-2.jpg'
];

const realImages = [
  'assets/game-images/real-1.jpg',
  'assets/game-images/real-2.jpg'
];
```

**Not:** Şu anda placeholder görseller (picsum.photos) kullanılıyor. Gerçek görselleri ekledikten sonra JS dosyasını güncelleyin.
