// Vercel serverless handler for /api/generate-pair
// This file is intentionally a handler (no app.listen) so it works on serverless platforms.

const CACHE_SIZE = 5; // Daha fazla önbellek
let imageCache = [];

// Gerçek fotoğraf havuzu - Picsum Photos (sabit ID'ler, hızlı yükleme)
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
  'https://picsum.photos/id/152/800/800'   // Detay
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
