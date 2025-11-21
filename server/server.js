import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Görsel cache sistemi
let imageCache = [];
const CACHE_SIZE = 5; // Önceden 5 görsel hazırla

// Gerçek görsel havuzu - Unsplash çeşitli kategoriler
const realImagePool = [
  // İnsanlar
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  
  // Doğa & Manzara
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=800&fit=crop',
  
  // Hayvanlar
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=800&fit=crop',
  
  // Şehir & Mimari
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=800&fit=crop',
  
  // Yiyecek
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&h=800&fit=crop',
  
  // Nesneler & Diğer
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=800&fit=crop'
];

// Sabit seed'li AI görseller (cache'den hızlı gelir, her zaman aynı görsel)
const aiImagePool = [
  'https://image.pollinations.ai/prompt/photorealistic%20portrait%20smiling%20professional%20lighting?width=800&height=800&seed=12345&nologo=true',
  'https://image.pollinations.ai/prompt/mountain%20landscape%20sunset%20photorealistic?width=800&height=800&seed=23456&nologo=true',
  'https://image.pollinations.ai/prompt/beach%20crystal%20water%20palm%20trees?width=800&height=800&seed=34567&nologo=true',
  'https://image.pollinations.ai/prompt/forest%20sunlight%20trees%20nature?width=800&height=800&seed=45678&nologo=true',
  'https://image.pollinations.ai/prompt/waterfall%20tropical%20rainforest?width=800&height=800&seed=56789&nologo=true',
  'https://image.pollinations.ai/prompt/lion%20portrait%20wildlife%20photography?width=800&height=800&seed=67890&nologo=true',
  'https://image.pollinations.ai/prompt/golden%20retriever%20puppy%20grass?width=800&height=800&seed=78901&nologo=true',
  'https://image.pollinations.ai/prompt/city%20skyline%20night%20buildings?width=800&height=800&seed=89012&nologo=true',
  'https://image.pollinations.ai/prompt/european%20street%20architecture?width=800&height=800&seed=90123&nologo=true',
  'https://image.pollinations.ai/prompt/coffee%20shop%20interior%20cozy?width=800&height=800&seed=11234&nologo=true',
  'https://image.pollinations.ai/prompt/gourmet%20burger%20food%20photography?width=800&height=800&seed=22345&nologo=true',
  'https://image.pollinations.ai/prompt/colorful%20parrot%20branch%20wildlife?width=800&height=800&seed=33456&nologo=true',
  'https://image.pollinations.ai/prompt/butterfly%20flower%20macro%20photography?width=800&height=800&seed=44567&nologo=true',
  'https://image.pollinations.ai/prompt/elephant%20family%20savanna%20sunset?width=800&height=800&seed=55678&nologo=true',
  'https://image.pollinations.ai/prompt/glass%20building%20futuristic%20architecture?width=800&height=800&seed=66789&nologo=true'
];

// Görsel üretme fonksiyonu
function generateImagePair() {
  const aiImage = aiImagePool[Math.floor(Math.random() * aiImagePool.length)];
  const realImage = realImagePool[Math.floor(Math.random() * realImagePool.length)];
  
  const images = Math.random() > 0.5 
    ? { left: aiImage, right: realImage, aiPosition: 'left' }
    : { left: realImage, right: aiImage, aiPosition: 'right' };
  
  return {
    success: true,
    leftImage: images.left,
    rightImage: images.right,
    aiPosition: images.aiPosition,
    prompt: 'AI generated image'
  };
}

// Cache'i doldur
function fillCache() {
  while (imageCache.length < CACHE_SIZE) {
    const pair = generateImagePair();
    imageCache.push(pair);
    console.log(`📦 Cache'e eklendi (${imageCache.length}/${CACHE_SIZE}): "${pair.prompt.substring(0, 50)}..."`);
  }
}

// Ana endpoint: Cache'ten hızlı görsel gönder
app.post('/api/generate-pair', async (req, res) => {
  try {
    // Cache'ten bir görsel al
    let imagePair;
    if (imageCache.length > 0) {
      imagePair = imageCache.shift();
      console.log(`⚡ Cache'ten hızlı gönderildi (Kalan: ${imageCache.length}/${CACHE_SIZE})`);
      
      // Arka planda cache'i doldur
      setTimeout(() => fillCache(), 100);
    } else {
      // Cache boşsa anında üret (fallback)
      console.log(`⚠️  Cache boş, anında üretiliyor...`);
      imagePair = generateImagePair();
      fillCache(); // Cache'i doldur
    }

    res.json(imagePair);

  } catch (error) {
    console.error('❌ Sunucu hatası:', error);
    res.status(500).json({ 
      error: 'Sunucu hatası',
      details: error.message 
    });
  }
});

// Sağlık kontrolü
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI vs Real backend çalışıyor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/generate-pair`);
  console.log(`🎨 AI Engine: Pollinations.ai (Ücretsiz, sınırsız)`);
  console.log(`⚡ Görsel cache sistemi aktif (${CACHE_SIZE} görsel önceden hazırlanıyor...)\n`);
  
  // Başlangıçta cache'i doldur
  fillCache();
});
