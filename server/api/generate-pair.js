// Vercel serverless handler for /api/generate-pair
// This file is intentionally a handler (no app.listen) so it works on serverless platforms.

const CACHE_SIZE = 10; // Daha fazla önbellek (5 → 10)
let imageCache = [];

// Kullanılmış görselleri takip et
let usedAiImages = [];
let usedRealImages = [];

// Gerçek fotoğraf havuzu - Picsum Photos (512x512 hızlı yükleme)
const realImagePool = [
  'https://picsum.photos/id/10/512/512',   // Manzara
  'https://picsum.photos/id/15/512/512',   // Doğa
  'https://picsum.photos/id/20/512/512',   // Şehir
  'https://picsum.photos/id/24/512/512',   // Dağ
  'https://picsum.photos/id/28/512/512',   // Orman
  'https://picsum.photos/id/33/512/512',   // Sahil
  'https://picsum.photos/id/40/512/512',   // Mimari
  'https://picsum.photos/id/48/512/512',   // Doğa
  'https://picsum.photos/id/56/512/512',   // Bina
  'https://picsum.photos/id/64/512/512',   // Hayvan
  'https://picsum.photos/id/72/512/512',   // Sokak
  'https://picsum.photos/id/82/512/512',   // Bitki
  'https://picsum.photos/id/96/512/512',   // Deniz
  'https://picsum.photos/id/103/512/512',  // Gökyüzü
  'https://picsum.photos/id/111/512/512',  // Şehir
  'https://picsum.photos/id/119/512/512',  // Doğa
  'https://picsum.photos/id/129/512/512',  // Manzara
  'https://picsum.photos/id/137/512/512',  // Yapı
  'https://picsum.photos/id/145/512/512',  // Kırsal
  'https://picsum.photos/id/152/512/512',  // Detay
  'https://picsum.photos/id/160/512/512',  // Portre
  'https://picsum.photos/id/164/512/512',  // Manzara
  'https://picsum.photos/id/169/512/512',  // Şehir
  'https://picsum.photos/id/175/512/512',  // Doğa
  'https://picsum.photos/id/180/512/512',  // Sahil
  'https://picsum.photos/id/188/512/512',  // Hayvan
  'https://picsum.photos/id/193/512/512',  // Mimari
  'https://picsum.photos/id/201/512/512',  // Orman
  'https://picsum.photos/id/206/512/512',  // Şehir
  'https://picsum.photos/id/213/512/512'   // Dağ
];

// Multi-provider AI görseller - Optimize edilmiş (512x512 hızlı yükleme)
// Sadece güvenilir, hızlı servisler
const aiImagePool = [
  // Pollinations.ai - Hızlı ve güvenilir (70% - 21 görsel)
  'https://image.pollinations.ai/prompt/photorealistic%20portrait%20professional%20studio%20lighting?width=512&height=512&seed=12345&nologo=true',
  'https://image.pollinations.ai/prompt/mountain%20landscape%20sunset%20photography?width=512&height=512&seed=23456&nologo=true',
  'https://image.pollinations.ai/prompt/beach%20crystal%20water%20palm%20trees?width=512&height=512&seed=34567&nologo=true',
  'https://image.pollinations.ai/prompt/forest%20sunlight%20trees%20nature?width=512&height=512&seed=45678&nologo=true',
  'https://image.pollinations.ai/prompt/waterfall%20tropical%20rainforest?width=512&height=512&seed=56789&nologo=true',
  'https://image.pollinations.ai/prompt/lion%20portrait%20wildlife%20photography?width=512&height=512&seed=67890&nologo=true',
  'https://image.pollinations.ai/prompt/golden%20retriever%20puppy%20grass?width=512&height=512&seed=78901&nologo=true',
  'https://image.pollinations.ai/prompt/city%20skyline%20night%20buildings?width=512&height=512&seed=89012&nologo=true',
  'https://image.pollinations.ai/prompt/european%20street%20architecture?width=512&height=512&seed=90123&nologo=true',
  'https://image.pollinations.ai/prompt/coffee%20shop%20interior%20cozy?width=512&height=512&seed=11234&nologo=true',
  'https://image.pollinations.ai/prompt/gourmet%20burger%20food%20photography?width=512&height=512&seed=22345&nologo=true',
  'https://image.pollinations.ai/prompt/colorful%20parrot%20branch%20wildlife?width=512&height=512&seed=33456&nologo=true',
  'https://image.pollinations.ai/prompt/butterfly%20flower%20macro%20photography?width=512&height=512&seed=44567&nologo=true',
  'https://image.pollinations.ai/prompt/elephant%20family%20savanna%20sunset?width=512&height=512&seed=55678&nologo=true',
  'https://image.pollinations.ai/prompt/glass%20building%20futuristic%20architecture?width=512&height=512&seed=66789&nologo=true',
  'https://image.pollinations.ai/prompt/snowy%20mountain%20peak%20dramatic%20clouds?width=512&height=512&seed=77890&nologo=true',
  'https://image.pollinations.ai/prompt/tropical%20sunset%20ocean%20horizon?width=512&height=512&seed=88901&nologo=true',
  'https://image.pollinations.ai/prompt/modern%20interior%20design%20minimalist?width=512&height=512&seed=99012&nologo=true',
  'https://image.pollinations.ai/prompt/vintage%20car%20street%20photography?width=512&height=512&seed=10123&nologo=true',
  'https://image.pollinations.ai/prompt/japanese%20garden%20cherry%20blossoms?width=512&height=512&seed=21234&nologo=true',
  'https://image.pollinations.ai/prompt/desert%20dunes%20golden%20hour?width=512&height=512&seed=32345&nologo=true',
  
  // Artbreeder (stable diffusion based) - (30% - 9 görsel)
  'https://image.pollinations.ai/prompt/wolf%20portrait%20snow%20wilderness?width=512&height=512&seed=43456&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/autumn%20forest%20colorful%20leaves?width=512&height=512&seed=54567&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/northern%20lights%20aurora%20lake?width=512&height=512&seed=65678&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/bamboo%20forest%20misty%20morning?width=512&height=512&seed=76789&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/underwater%20coral%20reef%20tropical%20fish?width=512&height=512&seed=87890&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/industrial%20abandoned%20factory%20urban?width=512&height=512&seed=98901&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/lavender%20field%20purple%20sunset?width=512&height=512&seed=19012&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/medieval%20castle%20mountainside?width=512&height=512&seed=20123&nologo=true&model=flux',
  'https://image.pollinations.ai/prompt/neon%20city%20cyberpunk%20rain?width=512&height=512&seed=31234&nologo=true&model=flux'
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
