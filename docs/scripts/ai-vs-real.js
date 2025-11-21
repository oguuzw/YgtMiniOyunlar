// AI vs Gerçek oyun mantığı - Takım modu
const nextBtn = document.getElementById('next-round');
const statusEl = document.getElementById('status');
const leftImg = document.getElementById('left-img');
const rightImg = document.getElementById('right-img');
const leftCard = document.getElementById('left-card');
const rightCard = document.getElementById('right-card');
const resultMsg = document.getElementById('result-message');
const scoreAEl = document.getElementById('score-a');
const scoreBEl = document.getElementById('score-b');
const turnIndicator = document.getElementById('turn-indicator');
const currentTurnEl = document.getElementById('current-turn');

// Production'da Vercel URL, development'ta localhost
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api/generate-pair'
  : '/api/generate-pair';

// Takım sistemi
let scoreA = 0;
let scoreB = 0;
let currentTeam = 'A'; // 'A' veya 'B'
const WIN_SCORE = 5;

let aiPosition = 'left';
let canChoose = false;
let nextImagePair = null;
let secondImagePair = null;
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
  leftCard.style.pointerEvents = 'none';
  rightCard.style.pointerEvents = 'none';
  nextBtn.disabled = true;
  
  // Loading animasyonlarını göster
  const leftLoader = document.getElementById('left-loader');
  const rightLoader = document.getElementById('right-loader');
  leftLoader.classList.add('loading');
  rightLoader.classList.add('loading');

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
      // Loading animasyonlarını gizle
      leftLoader.classList.remove('loading');
      rightLoader.classList.remove('loading');
      
      // Aynı anda göster
      leftImg.style.transition = 'opacity 0.3s ease-in';
      rightImg.style.transition = 'opacity 0.3s ease-in';
      leftImg.style.opacity = '1';
      rightImg.style.opacity = '1';
      
      soundManager.play('newRound');
      setStatus('Hangi görsel AI tarafından üretildi?');
      canChoose = true;
      leftCard.style.pointerEvents = 'auto';
      rightCard.style.pointerEvents = 'auto';
      nextBtn.disabled = false;
      
      // Arka planda sonraki görseli yükle
      preloadNextPair();
    });

  } catch (error) {
    console.error('❌ Hata:', error);
    setStatus('❌ Hata: ' + error.message + ' (Backend sunucusu çalışıyor mu?)');
    nextBtn.disabled = false;
    // Hata durumunda loading animasyonlarını gizle
    leftLoader.classList.remove('loading');
    rightLoader.classList.remove('loading');
  }
}

function updateScoreboard() {
  scoreAEl.textContent = scoreA;
  scoreBEl.textContent = scoreB;
  
  // Aktif takımı vurgula
  const teamACard = document.querySelector('.team-a');
  const teamBCard = document.querySelector('.team-b');
  
  if (currentTeam === 'A') {
    teamACard.classList.add('active');
    teamBCard.classList.remove('active');
    currentTurnEl.textContent = '⚡ A';
  } else {
    teamBCard.classList.add('active');
    teamACard.classList.remove('active');
    currentTurnEl.textContent = '🔥 B';
  }
}

function checkWinner() {
  if (scoreA >= WIN_SCORE) {
    return 'A';
  } else if (scoreB >= WIN_SCORE) {
    return 'B';
  }
  return null;
}

function showGameOver(winner) {
  soundManager.play('win');
  const overlay = document.getElementById('result-overlay');
  const icon = document.getElementById('result-icon');
  const message = document.getElementById('result-message');
  const detail = document.getElementById('result-detail');
  
  overlay.classList.add('show', 'success');
  icon.textContent = '🏆';
  message.textContent = `${winner === 'A' ? '⚡ A' : '🔥 B'} Takımı Kazandı!`;
  detail.textContent = `Tebrikler! ${scoreA}-${scoreB}`;
  
  // Oyunu sıfırla
  setTimeout(() => {
    scoreA = 0;
    scoreB = 0;
    currentTeam = 'A';
    updateScoreboard();
    overlay.classList.remove('show');
    loadRound();
  }, 5000);
}

function choose(side){
  if(!canChoose) return;
  canChoose = false;
  leftCard.style.pointerEvents = 'none';
  rightCard.style.pointerEvents = 'none';

  const selectedIsAI = (side === aiPosition);
  const overlay = document.getElementById('result-overlay');
  const icon = document.getElementById('result-icon');
  const message = document.getElementById('result-message');
  const detail = document.getElementById('result-detail');
  
  overlay.classList.add('show');
  
  if(selectedIsAI){
    // Doğru cevap - puan ekle
    soundManager.play('correct');
    if (currentTeam === 'A') {
      scoreA++;
    } else {
      scoreB++;
    }
    
    overlay.classList.add('success');
    overlay.classList.remove('failure');
    icon.textContent = '🎉';
    message.textContent = `${currentTeam === 'A' ? '⚡ A' : '🔥 B'} Takımı +1 Puan!`;
    detail.textContent = 'Doğru bildiniz! 🎯';
    message.style.background = 'linear-gradient(135deg, #00f2fe, #4facfe)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
    
    updateScoreboard();
    
    // Kazanan kontrolü
    const winner = checkWinner();
    if (winner) {
      setTimeout(() => {
        overlay.classList.remove('show');
        showGameOver(winner);
      }, 2000);
      return;
    }
  } else {
    // Yanlış cevap
    soundManager.play('wrong');
    overlay.classList.add('failure');
    overlay.classList.remove('success');
    icon.textContent = '😔';
    message.textContent = 'Yanlış!';
    detail.textContent = 'AI görseli ' + (aiPosition === 'left' ? 'SOLDAYDI' : 'SAĞDAYDI') + ' 🤖';
    message.style.background = 'linear-gradient(135deg, #ff6b9d, #c471f5)';
    message.style.webkitBackgroundClip = 'text';
    message.style.webkitTextFillColor = 'transparent';
  }
  
  // Sırayı değiştir
  currentTeam = currentTeam === 'A' ? 'B' : 'A';
  updateScoreboard();
  
  // 2 saniye sonra kapat ve yeni tur
  setTimeout(() => {
    overlay.classList.remove('show');
    loadRound();
  }, 2000);
  
  // Overlay'e tıklayınca kapat
  overlay.onclick = () => {
    overlay.classList.remove('show');
    loadRound();
  };
}

nextBtn.addEventListener('click', (e)=>{ e.preventDefault(); soundManager.play('click'); loadRound(); });
leftCard.addEventListener('click', ()=> { soundManager.play('click'); choose('left'); });
rightCard.addEventListener('click', ()=> { soundManager.play('click'); choose('right'); });

// Tutorial modal kontrolü
const tutorialOverlay = document.getElementById('tutorial-overlay');
const startGameBtn = document.getElementById('start-game-btn');

startGameBtn.addEventListener('click', () => {
  soundManager.play('click');
  tutorialOverlay.classList.remove('show');
  localStorage.setItem('ai-vs-real-tutorial-seen', 'true');
});

// Ana sayfaya dönüş animasyonu (herhangi bir çıkış tuşunda)
function showLoadingAndNavigate(url) {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    pageLoader.classList.remove('hidden');
    pageLoader.style.display = 'flex';
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  } else {
    window.location.href = url;
  }
}

const backToHomeBtn = document.getElementById('back-to-home');
if (backToHomeBtn) {
  backToHomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingAndNavigate('index.html');
  });
}

// Tüm linkleri yakala ve loading animasyonu göster
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.href && !link.hasAttribute('data-no-loading')) {
    // Aynı sayfaya giden linkler hariç
    const currentPage = window.location.pathname.split('/').pop();
    const targetPage = link.getAttribute('href');
    
    // Dış link veya anchor değilse
    if (targetPage && !targetPage.startsWith('#') && !targetPage.startsWith('http') && targetPage !== currentPage) {
      e.preventDefault();
      showLoadingAndNavigate(targetPage);
    }
  }
});

// Sayfa yüklenince otomatik başlat
window.addEventListener('DOMContentLoaded', ()=> {
  updateScoreboard();
  
  // Tutorial gösterilmişse direkt başlat
  const tutorialSeen = localStorage.getItem('ai-vs-real-tutorial-seen');
  if (tutorialSeen) {
    tutorialOverlay.classList.remove('show');
  }
  
  loadRound();
  // İlk yüklemede 2 tur önceden yükle
  setTimeout(() => preloadNextPair(), 1000);
});
