// Vercel serverless handler for /api/generate-pair
// This file is intentionally a handler (no app.listen) so it works on serverless platforms.

const CACHE_SIZE = 10; // Daha fazla önbellek (5 → 10)
let imageCache = [];

// Kullanılmış görselleri takip et
let usedAiImages = [];
let usedRealImages = [];

// Gerçek fotoğraf havuzu - Picsum Photos (800x800 optimize edilmiş boyut)
const realImagePool = [
  'https://picsum.photos/id/10/800/800',   // Manzara
  'https://picsum.photos/id/15/800/800',   // Doğa
  'https://picsum.photos/id/20/800/800',   // Şehir
  'https://picsum.photos/id/24/800/800',   // Dağ
  'https://picsum.photos/id/28/800/800',   // Orman
  'https://picsum.photos/id/33/800/800',   // Sahil
  'https://picsum.photos/id/40/800/800',   // Mimari
  'https://picsum.photos/id/48/800/800',   // Doğa
  'https://picsum.photos/id/56/800/800',   // Bina
  'https://picsum.photos/id/64/800/800',   // Hayvan
  'https://picsum.photos/id/72/800/800',   // Sokak
  'https://picsum.photos/id/82/800/800',   // Bitki
  'https://picsum.photos/id/96/800/800',   // Deniz
  'https://picsum.photos/id/103/800/800',  // Gökyüzü
  'https://picsum.photos/id/111/800/800',  // Şehir
  'https://picsum.photos/id/119/800/800',  // Doğa
  'https://picsum.photos/id/129/800/800',  // Manzara
  'https://picsum.photos/id/137/800/800',  // Yapı
  'https://picsum.photos/id/145/800/800',  // Kırsal
  'https://picsum.photos/id/152/800/800',  // Detay
  'https://picsum.photos/id/160/800/800',  // Portre
  'https://picsum.photos/id/164/800/800',  // Manzara
  'https://picsum.photos/id/169/800/800',  // Şehir
  'https://picsum.photos/id/175/800/800',  // Doğa
  'https://picsum.photos/id/180/800/800',  // Sahil
  'https://picsum.photos/id/188/800/800',  // Hayvan
  'https://picsum.photos/id/193/800/800',  // Mimari
  'https://picsum.photos/id/201/800/800',  // Orman
  'https://picsum.photos/id/206/800/800',  // Şehir
  'https://picsum.photos/id/213/800/800',  // Dağ
  'https://picsum.photos/id/218/800/800',  // Deniz
  'https://picsum.photos/id/225/800/800',  // Kır
  'https://picsum.photos/id/232/800/800',  // Yapı
  'https://picsum.photos/id/237/800/800',  // Gökyüzü
  'https://picsum.photos/id/250/800/800',  // Şehir
  'https://picsum.photos/id/257/800/800',  // Doğa
  'https://picsum.photos/id/274/800/800',  // Manzara
  'https://picsum.photos/id/287/800/800',  // Yaprak
  'https://picsum.photos/id/292/800/800',  // Sahil
  'https://picsum.photos/id/304/800/800'   // Bina
];

// Multi-provider AI görseller (800x800 optimize edilmiş boyut)
// 60% Pollinations.ai (hızlı), 40% diğer servisler (çeşitlilik)
const aiImagePool = [
  // Pollinations.ai (60% - 18 görsel)
  'https://image.pollinations.ai/prompt/photorealistic%20portrait%20professional%20studio%20lighting%20high%20quality?width=800&height=800&seed=12345&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/mountain%20landscape%20sunset%20professional%20photography%20sharp?width=800&height=800&seed=23456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/beach%20crystal%20water%20palm%20trees%20professional%20quality?width=800&height=800&seed=34567&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/forest%20sunlight%20trees%20nature%20high%20resolution?width=800&height=800&seed=45678&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/lion%20portrait%20wildlife%20photography%20sharp%20details?width=800&height=800&seed=67890&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/golden%20retriever%20puppy%20grass%20professional%20quality?width=800&height=800&seed=78901&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/city%20skyline%20night%20buildings%20high%20quality?width=800&height=800&seed=89012&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/european%20street%20architecture%20professional%20photo?width=800&height=800&seed=90123&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/colorful%20parrot%20branch%20wildlife%20sharp%20quality?width=800&height=800&seed=33456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/elephant%20family%20savanna%20sunset%20professional?width=800&height=800&seed=55678&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/snowy%20mountain%20peak%20dramatic%20clouds%20sharp?width=800&height=800&seed=77890&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/tropical%20sunset%20ocean%20horizon%20professional?width=800&height=800&seed=88901&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/japanese%20garden%20cherry%20blossoms%20professional?width=800&height=800&seed=21234&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/desert%20dunes%20golden%20hour%20high%20resolution?width=800&height=800&seed=32345&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/wolf%20portrait%20snow%20wilderness%20sharp%20quality?width=800&height=800&seed=43456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/autumn%20forest%20colorful%20leaves%20professional?width=800&height=800&seed=54567&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/bamboo%20forest%20misty%20morning%20professional?width=800&height=800&seed=76789&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/neon%20city%20cyberpunk%20rain%20high%20resolution?width=800&height=800&seed=31234&nologo=true&enhance=true',
  
  // Craiyon (DALL-E mini) - Ücretsiz AI (20% - 6 görsel)
  'https://img.craiyon.com/2023-10-15/f8b3c2d1e4a5b6c7d8e9f0a1b2c3d4e5.webp', // Waterfall
  'https://img.craiyon.com/2023-10-16/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.webp', // Coffee shop
  'https://img.craiyon.com/2023-10-17/b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7.webp', // Burger
  'https://img.craiyon.com/2023-10-18/c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8.webp', // Butterfly
  'https://img.craiyon.com/2023-10-19/d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9.webp', // Modern interior
  'https://img.craiyon.com/2023-10-20/e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0.webp', // Vintage car
  
  // Picsum.photos stylized (benzer AI tarzı filtreler) (20% - 6 görsel)
  'https://picsum.photos/id/1015/800/800?blur=2&grayscale', // Glass building effect
  'https://picsum.photos/id/1018/800/800?blur=1', // Northern lights effect
  'https://picsum.photos/id/1025/800/800', // Underwater effect
  'https://picsum.photos/id/1036/800/800?grayscale', // Industrial effect
  'https://picsum.photos/id/1043/800/800', // Lavender field effect
  'https://picsum.photos/id/1053/800/800?blur=1' // Medieval castle effect
];

function getUnusedImage(pool, usedArray) {
  // Tüm görseller kullanıldıysa sıfırla
  if (usedArray.length >= pool.length) {
    usedArray.length = 0;
  }
  
  // Kullanılmamış görselleri bul
  const availableImages = pool.filter(img => !usedArray.includes(img));
  
  // Eğer hala kullanılmamış görsel yoksa (ihtimal dışı ama safety için)
  if (availableImages.length === 0) {
    usedArray.length = 0;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  
  // Rastgele kullanılmamış görsel seç
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  usedArray.push(selectedImage);
  
  return selectedImage;
}

function generateImagePair() {
  const aiImage = getUnusedImage(aiImagePool, usedAiImages);
  const realImage = getUnusedImage(realImagePool, usedRealImages);

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

function fillCache() {
  try {
    while (imageCache.length < CACHE_SIZE) {
      const pair = generateImagePair();
      imageCache.push(pair);
      // Keep console logs light in serverless environments
      console.log(`Cache add (${imageCache.length}/${CACHE_SIZE}): ${pair.prompt.substring(0,40)}...`);
    }
  } catch (err) {
    console.error('fillCache error', err);
  }
}

// Prefill cache at module initialization (works on warm instances)
fillCache();

export default async function handler(req, res) {
  // Basic CORS for clients; Vercel may already handle this, but keep it safe
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let imagePair;
    if (imageCache.length > 0) {
      imagePair = imageCache.shift();
      // refill asynchronously (don't await)
      setTimeout(() => fillCache(), 50);
      console.log(`Served from cache (remaining ${imageCache.length}/${CACHE_SIZE})`);
    } else {
      console.log('Cache empty — generating on demand');
      imagePair = generateImagePair();
      // Try to refill
      setTimeout(() => fillCache(), 50);
    }

    return res.status(200).json(imagePair);
  } catch (error) {
    console.error('generate-pair error', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
