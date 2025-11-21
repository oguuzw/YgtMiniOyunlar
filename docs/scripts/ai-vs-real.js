// AI vs Gerçek oyun mantığı - backend proxy ile gerçek zamanlı üretim
const nextBtn = document.getElementById('next-round');
const statusEl = document.getElementById('status');
const leftImg = document.getElementById('left-img');
const rightImg = document.getElementById('right-img');
const leftChoose = document.getElementById('left-choose');
const rightChoose = document.getElementById('right-choose');
const resultMsg = document.getElementById('result-message');

// Production'da Vercel URL, development'ta localhost
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/generate-pair'
  : '/api/generate-pair';

let aiPosition = 'left';
let canChoose = false;
let nextImagePair = null;
let secondImagePair = null; // 2. sıradaki çift
let isPreloading = false;

function setStatus(s){ statusEl.textContent = s; }

// Görseli tarayıcı cache'ine yükle (görünmez img ile)
function preloadImage(url) {
  const img = new Image();
  img.src = url;
}

// Arka planda sonraki görseli yükle (2 tur önceden)
async function preloadNextPair() {
  if (isPreloading) return;
  isPreloading = true;
  
  try {
    // İlk sıradaki çifti al
    if (!nextImagePair) {
      const response1 = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response1.ok) {
        nextImagePair = await response1.json();
        // Görselleri tarayıcı cache'ine yükle
        preloadImage(nextImagePair.leftImage);
        preloadImage(nextImagePair.rightImage);
        console.log('⚡ 1. görsel hazır');
      }
    }
    
    // İkinci sıradaki çifti al
    if (!secondImagePair) {
      const response2 = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response2.ok) {
        secondImagePair = await response2.json();
        // Görselleri tarayıcı cache'ine yükle
        preloadImage(secondImagePair.leftImage);
        preloadImage(secondImagePair.rightImage);
        console.log('⚡ 2. görsel hazır');
      }
    }
  } catch (error) {
    console.log('⚠️ Preload hatası');
  } finally {
    isPreloading = false;
  }
}

async function loadRound(){
  document.getElementById('result-overlay').classList.remove('show');
  canChoose = false;
  leftChoose.disabled = true;
  rightChoose.disabled = true;
  nextBtn.disabled = true;

  try {
    let data;
    
    // Cache'te hazır görsel varsa onu kullan
    if (nextImagePair) {
      console.log('⚡ Cache\'ten anında yüklendi!');
      data = nextImagePair;
      // Sıradaki görselleri kaydır
      nextImagePair = secondImagePair;
      secondImagePair = null;
      setStatus('⚡ Görseller yükleniyor...');
    } else {
      // Cache boşsa API'den al
      setStatus('🎨 Görseller yükleniyor...');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API isteği başarısız');
      }

      data = await response.json();
      // Görselleri hemen cache'e al
      preloadImage(data.leftImage);
      preloadImage(data.rightImage);
    }
    
    aiPosition = data.aiPosition;

    // Görselleri gizli tut
    leftImg.style.opacity = '0';
    rightImg.style.opacity = '0';
    
    // Her iki görseli yükle ama görünmez yap
    leftImg.src = data.leftImage;
    rightImg.src = data.rightImage;

    // Her iki görsel tamamen yüklenince aynı anda göster
    Promise.all([
      new Promise(r => { leftImg.onload = r; leftImg.onerror = r; }),
      new Promise(r => { rightImg.onload = r; rightImg.onerror = r; })
    ]).then(() => {
      // Aynı anda göster
      leftImg.style.transition = 'opacity 0.3s ease-in';
      rightImg.style.transition = 'opacity 0.3s ease-in';
      leftImg.style.opacity = '1';
      rightImg.style.opacity = '1';
      
      setStatus('Hangi görsel AI tarafından üretildi?');
      canChoose = true;
      leftChoose.disabled = false;
      rightChoose.disabled = false;
      nextBtn.disabled = false;
      
      // Arka planda sonraki görseli yükle
      preloadNextPair();
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    setStatus('❌ Hata: ' + error.message + ' (Backend sunucusu çalışıyor mu?)');
    nextBtn.disabled = false;
  }
}

function choose(side){
  if(!canChoose) return;
  canChoose = false;
  leftChoose.disabled = true;
  rightChoose.disabled = true;

  const selectedIsAI = (side === aiPosition);
  const overlay = document.getElementById('result-overlay');
  const icon = document.getElementById('result-icon');
  const message = document.getElementById('result-message');
  const detail = document.getElementById('result-detail');
  
  overlay.classList.add('show');
  
  if(selectedIsAI){
    overlay.classList.add('success');
    overlay.classList.remove('failure');
    icon.textContent = '🎉';
    message.textContent = 'Tebrikler!';
    detail.textContent = 'Doğru bildiniz! 🎯';
    message.style.background = 'linear-gradient(135deg, #00f2fe, #4facfe)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
  } else {
    overlay.classList.add('failure');
    overlay.classList.remove('success');
    icon.textContent = '😔';
    message.textContent = 'Yanlış!';
    detail.textContent = 'AI görseli ' + (aiPosition === 'left' ? 'SOLDAYDI' : 'SAĞDAYDI') + ' 🤖';
    message.style.background = 'linear-gradient(135deg, #ff6b9d, #c471f5)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
  }
  
  setStatus('Yeni tur için "Yeni Tur" butonuna basın.');
  
  // 3 saniye sonra otomatik kapat
  setTimeout(() => {
    overlay.classList.remove('show');
  }, 3000);
  
  // Overlay'e tıklayınca kapat
  overlay.onclick = () => overlay.classList.remove('show');
}

nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); loadRound(); });
leftChoose.addEventListener('click', ()=> choose('left'));
rightChoose.addEventListener('click', ()=> choose('right'));

// Sayfa yüklenince otomatik başlat
window.addEventListener('DOMContentLoaded', ()=> {
  loadRound();
  // İlk yüklemede 2 tur önceden yükle
  setTimeout(() => preloadNextPair(), 1000);
});
