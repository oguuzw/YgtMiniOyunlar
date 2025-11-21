// Vercel serverless handler for /api/generate-pair
// This file is intentionally a handler (no app.listen) so it works on serverless platforms.

const CACHE_SIZE = 5; // Daha fazla önbellek
let imageCache = [];

// Kullanılmış görselleri takip et
let usedAiImages = [];
let usedRealImages = [];

// Gerçek fotoğraf havuzu - Picsum Photos (yüksek kalite, 1024x1024)
const realImagePool = [
  'https://picsum.photos/id/10/1024/1024',   // Manzara
  'https://picsum.photos/id/15/1024/1024',   // Doğa
  'https://picsum.photos/id/20/1024/1024',   // Şehir
  'https://picsum.photos/id/24/1024/1024',   // Dağ
  'https://picsum.photos/id/28/1024/1024',   // Orman
  'https://picsum.photos/id/33/1024/1024',   // Sahil
  'https://picsum.photos/id/40/1024/1024',   // Mimari
  'https://picsum.photos/id/48/1024/1024',   // Doğa
  'https://picsum.photos/id/56/1024/1024',   // Bina
  'https://picsum.photos/id/64/1024/1024',   // Hayvan
  'https://picsum.photos/id/72/1024/1024',   // Sokak
  'https://picsum.photos/id/82/1024/1024',   // Bitki
  'https://picsum.photos/id/96/1024/1024',   // Deniz
  'https://picsum.photos/id/103/1024/1024',  // Gökyüzü
  'https://picsum.photos/id/111/1024/1024',  // Şehir
  'https://picsum.photos/id/119/1024/1024',  // Doğa
  'https://picsum.photos/id/129/1024/1024',  // Manzara
  'https://picsum.photos/id/137/1024/1024',  // Yapı
  'https://picsum.photos/id/145/1024/1024',  // Kırsal
  'https://picsum.photos/id/152/1024/1024',  // Detay
  'https://picsum.photos/id/160/1024/1024',  // Portre
  'https://picsum.photos/id/164/1024/1024',  // Manzara
  'https://picsum.photos/id/169/1024/1024',  // Şehir
  'https://picsum.photos/id/175/1024/1024',  // Doğa
  'https://picsum.photos/id/180/1024/1024',  // Sahil
  'https://picsum.photos/id/188/1024/1024',  // Hayvan
  'https://picsum.photos/id/193/1024/1024',  // Mimari
  'https://picsum.photos/id/201/1024/1024',  // Orman
  'https://picsum.photos/id/206/1024/1024',  // Şehir
  'https://picsum.photos/id/213/1024/1024',  // Dağ
  'https://picsum.photos/id/218/1024/1024',  // Deniz
  'https://picsum.photos/id/225/1024/1024',  // Kır
  'https://picsum.photos/id/232/1024/1024',  // Yapı
  'https://picsum.photos/id/237/1024/1024',  // Gökyüzü
  'https://picsum.photos/id/250/1024/1024',  // Şehir
  'https://picsum.photos/id/257/1024/1024',  // Doğa
  'https://picsum.photos/id/274/1024/1024',  // Manzara
  'https://picsum.photos/id/287/1024/1024',  // Yaprak
  'https://picsum.photos/id/292/1024/1024',  // Sahil
  'https://picsum.photos/id/304/1024/1024'   // Bina
];

// Sabit seed'li AI görseller (yüksek kalite, profesyonel görünüm)
const aiImagePool = [
  'https://image.pollinations.ai/prompt/photorealistic%20portrait%20professional%20studio%20lighting%20high%20quality?width=1024&height=1024&seed=12345&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/mountain%20landscape%20sunset%20professional%20photography%20sharp?width=1024&height=1024&seed=23456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/beach%20crystal%20water%20palm%20trees%20professional%20quality?width=1024&height=1024&seed=34567&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/forest%20sunlight%20trees%20nature%20high%20resolution?width=1024&height=1024&seed=45678&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/waterfall%20tropical%20rainforest%20professional%20photography?width=1024&height=1024&seed=56789&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/lion%20portrait%20wildlife%20photography%20sharp%20details?width=1024&height=1024&seed=67890&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/golden%20retriever%20puppy%20grass%20professional%20quality?width=1024&height=1024&seed=78901&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/city%20skyline%20night%20buildings%20high%20quality?width=1024&height=1024&seed=89012&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/european%20street%20architecture%20professional%20photo?width=1024&height=1024&seed=90123&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/coffee%20shop%20interior%20cozy%20high%20resolution?width=1024&height=1024&seed=11234&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/gourmet%20burger%20food%20photography%20professional?width=1024&height=1024&seed=22345&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/colorful%20parrot%20branch%20wildlife%20sharp%20quality?width=1024&height=1024&seed=33456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/butterfly%20flower%20macro%20photography%20detailed?width=1024&height=1024&seed=44567&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/elephant%20family%20savanna%20sunset%20professional?width=1024&height=1024&seed=55678&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/glass%20building%20futuristic%20architecture%20high%20quality?width=1024&height=1024&seed=66789&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/snowy%20mountain%20peak%20dramatic%20clouds%20sharp?width=1024&height=1024&seed=77890&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/tropical%20sunset%20ocean%20horizon%20professional?width=1024&height=1024&seed=88901&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/modern%20interior%20design%20minimalist%20high%20quality?width=1024&height=1024&seed=99012&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/vintage%20car%20street%20photography%20detailed?width=1024&height=1024&seed=10123&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/japanese%20garden%20cherry%20blossoms%20professional?width=1024&height=1024&seed=21234&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/desert%20dunes%20golden%20hour%20high%20resolution?width=1024&height=1024&seed=32345&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/wolf%20portrait%20snow%20wilderness%20sharp%20quality?width=1024&height=1024&seed=43456&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/autumn%20forest%20colorful%20leaves%20professional?width=1024&height=1024&seed=54567&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/northern%20lights%20aurora%20lake%20high%20quality?width=1024&height=1024&seed=65678&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/bamboo%20forest%20misty%20morning%20professional?width=1024&height=1024&seed=76789&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/underwater%20coral%20reef%20tropical%20fish%20sharp?width=1024&height=1024&seed=87890&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/industrial%20abandoned%20factory%20urban%20detailed?width=1024&height=1024&seed=98901&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/lavender%20field%20purple%20sunset%20high%20quality?width=1024&height=1024&seed=19012&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/medieval%20castle%20mountainside%20professional?width=1024&height=1024&seed=20123&nologo=true&enhance=true',
  'https://image.pollinations.ai/prompt/neon%20city%20cyberpunk%20rain%20high%20resolution?width=1024&height=1024&seed=31234&nologo=true&enhance=true'
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
