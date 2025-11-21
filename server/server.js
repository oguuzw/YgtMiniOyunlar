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
const CACHE_SIZE = 3; // Önceden 3 görsel hazırla

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

// AI prompt havuzu - rastgele seçilecek (çeşitli kategoriler)
const aiPrompts = [
  // İnsanlar
  'photorealistic portrait of a person smiling, professional lighting, high detail',
  'close-up portrait of a young person with natural lighting, realistic photo',
  'professional headshot of a person in business attire, studio lighting',
  
  // Doğa & Manzara
  'breathtaking mountain landscape at sunset, photorealistic, high detail',
  'serene beach with crystal clear water and palm trees, realistic photo',
  'dense forest with sunlight filtering through trees, photorealistic nature',
  'beautiful waterfall in tropical rainforest, professional nature photography',
  'snowy mountain peak with dramatic clouds, landscape photography',
  
  // Hayvanlar
  'majestic lion portrait in natural habitat, wildlife photography, sharp focus',
  'colorful parrot sitting on a branch, professional wildlife photo',
  'cute golden retriever puppy playing in grass, photorealistic pet photo',
  'elephant family walking at sunset in savanna, wildlife photography',
  'close-up of a butterfly on a flower, macro photography, photorealistic',
  
  // Şehir & Mimari
  'modern city skyline at night with illuminated buildings, urban photography',
  'historic european street with old architecture, realistic travel photo',
  'futuristic glass building with reflection, architectural photography',
  'cozy coffee shop interior with warm lighting, lifestyle photography',
  
  // Yiyecek & İçecek
  'delicious gourmet burger with fresh ingredients, food photography, professional',
  'colorful fresh fruit arrangement, high quality food photo',
  'steaming cup of coffee with latte art, cafe photography',
  
  // Nesneler & Sanat
  'vintage camera on wooden table, product photography, professional lighting',
  'colorful abstract art with geometric shapes, digital art, photorealistic',
  'luxury sports car in dramatic lighting, automotive photography',
  'beautiful flowers in a vase, still life photography, soft focus'
];

// Görsel üretme fonksiyonu
function generateImagePair() {
  const prompt = aiPrompts[Math.floor(Math.random() * aiPrompts.length)];
  const realImage = realImagePool[Math.floor(Math.random() * realImagePool.length)];
  const encodedPrompt = encodeURIComponent(prompt);
  const aiImage = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
  
  const images = Math.random() > 0.5 
    ? { left: aiImage, right: realImage, aiPosition: 'left' }
    : { left: realImage, right: aiImage, aiPosition: 'right' };
  
  return {
    success: true,
    leftImage: images.left,
    rightImage: images.right,
    aiPosition: images.aiPosition,
    prompt: prompt
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
