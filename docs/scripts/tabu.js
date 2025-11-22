// Oyun kelimeleri ve yasaklı kelimeleri
const tabuWords = [
    {
        word: "ALGORİTMA",
        forbidden: ["ADIM", "ÇÖZÜM", "PROBLEM", "PLAN", "SIRA"]
    },
    {
        word: "KOD",
        forbidden: ["PROGRAM", "YAZMAK", "SATIR", "KOMUT", "DİL"]
    },
    {
        word: "DEĞİŞKEN",
        forbidden: ["VERİ", "TÜR", "ATAMA", "BELLEK", "SAYI"]
    },
    {
        word: "FONKSİYON",
        forbidden: ["ÇAĞIRMAK", "PARAMETRE", "GİRDİ", "ÇIKTI", "METOT"]
    },
    {
        word: "DÖNGÜ",
        forbidden: ["FOR", "WHILE", "TEKRAR", "SONSUZ", "ŞART"]
    },
    {
        word: "IF",
        forbidden: ["EĞER", "DOĞRU", "YANLIŞ", "ELSE", "KARAR"]
    },
    {
        word: "PROGRAMLAMA DİLİ",
        forbidden: ["C", "JAVA", "PYTHON", "YAZMAK", "KOD"]
    },
    {
        word: "BİLGİSAYAR",
        forbidden: ["DONANIM", "KLAVYE", "FARE", "EKRAN", "MAKİNE"]
    },
    {
        word: "KLAVYE",
        forbidden: ["TUŞ", "YAZMAK", "HARF", "ENTER", "Q"]
    },
    {
        word: "FARE",
        forbidden: ["TIKLAMAK", "SAĞ", "SOL", "SCROLL", "İŞARETÇİ"]
    },
    {
        word: "İŞLETİM SİSTEMİ",
        forbidden: ["WINDOWS", "LINUX", "MAC", "YAZILIM", "YÖNETİM"]
    },
    {
        word: "VERİ",
        forbidden: ["BİLGİ", "DEPOLAMA", "SAYI", "DOSYA", "TABLO"]
    },
    {
        word: "HAFIZA",
        forbidden: ["BELLEK", "GEÇİCİ", "HIZ", "KAPASİTE", "ÇALIŞMA"]
    },
    {
        word: "DEPOLAMA",
        forbidden: ["HDD", "SSD", "KALICI", "DOSYA", "VERİ"]
    },
    {
        word: "İNTERNET",
        forbidden: ["BAĞLANTI", "WEB", "ONLINE", "TARAYICI", "AĞ"]
    },
    {
        word: "SUNUCU",
        forbidden: ["SERVER", "HOSTING", "BİLGİSAYAR", "AĞ", "İSTEK"]
    },
    {
        word: "AĞ",
        forbidden: ["BAĞLANTI", "KABLOSUZ", "WI-FI", "LAN", "İNTERNET"]
    },
    {
        word: "KOMPİLASYON",
        forbidden: ["ÇALIŞTIRMAK", "KOD", "ÇEVİRME", "PROGRAM", "HATA"]
    },
    {
        word: "DEBUG",
        forbidden: ["YANLIŞ", "ÇÖZMEK", "TEST", "PROGRAM", "KOD"]
    },
    {
        word: "GIT",
        forbidden: ["GITHUB", "COMMIT", "REPO", "KOD", "PAYLAŞIM"]
    },
    {
        word: "KOMUT",
        forbidden: ["KOD", "EMİR", "ÇALIŞTIR", "PROGRAM", "TALİMAT"]
    },
    {
        word: "EDİTÖR",
        forbidden: ["YAZMAK", "KOD", "IDE", "NOTEPAD", "DÜZENLEME"]
    },
    {
        word: "IDE",
        forbidden: ["ECLIPSE", "VISUAL STUDIO", "KOD", "EDİTÖR", "ARAÇ"]
    },
    {
        word: "SYNTAX",
        forbidden: ["HATA", "KURAL", "KOD", "DOĞRU", "DİL"]
    },
    {
        word: "DERLEYİCİ",
        forbidden: ["ÇALIŞTIRMAK", "KOD", "ÇEVİRME", "PROGRAM", "HATA"]
    },
    {
        word: "YORUM SATIRI",
        forbidden: ["AÇIKLAMA", "KOD", "NOT", "SATIR", "GÖRÜNMEZ"]
    },
    {
        word: "BINARY",
        forbidden: ["0", "1", "SİSTEM", "BIT", "SAYI"]
    },
    {
        word: "BIT",
        forbidden: ["0", "1", "VERİ", "EN KÜÇÜK", "BİLGİ"]
    },
    {
        word: "BYTE",
        forbidden: ["8", "BIT", "VERİ", "ÖLÇÜ", "BELLEK"]
    },
    {
        word: "IP ADRESİ",
        forbidden: ["İNTERNET", "SAYI", "AĞ", "BAĞLANTI", "BİLGİSAYAR"]
    },
    {
        word: "URL",
        forbidden: ["WEB", "ADRES", "İNTERNET", "TARAYICI", "SİTE"]
    },
    {
        word: "TARAYICI",
        forbidden: ["CHROME", "FIREFOX", "WEB", "İNTERNET", "AÇMAK"]
    },
    {
        word: "VERİTABANI",
        forbidden: ["SQL", "VERİ", "TABLO", "KAYIT", "SİSTEM"]
    },
    {
        word: "TABLO",
        forbidden: ["SATIR", "SÜTUN", "VERİ", "VERİTABANI", "DÜZEN"]
    },
    {
        word: "ŞİFRE",
        forbidden: ["GÜVENLİK", "KULLANICI", "GİRİŞ", "HARF", "RAKAM"]
    },
    {
        word: "KULLANICI",
        forbidden: ["İNSAN", "PROGRAM", "ŞİFRE", "HESAP", "SİSTEM"]
    },
    {
        word: "ARAYÜZ",
        forbidden: ["EKRAN", "KULLANICI", "PROGRAM", "GÖRSEL", "MENÜ"]
    },
    {
        word: "DONANIM",
        forbidden: ["FİZİKSEL", "BİLGİSAYAR", "PARÇA", "KLAVYE", "EKRAN"]
    },
    {
        word: "YAZILIM",
        forbidden: ["PROGRAM", "KOD", "UYGULAMA", "BİLGİSAYAR", "SİSTEM"]
    },
    {
        word: "UYGULAMA",
        forbidden: ["PROGRAM", "TELEFON", "YAZILIM", "ÇALIŞTIRMAK", "MOBİL"]
    }
];

let currentWordIndex;
let teamCScore = 0;
let teamJavaScore = 0;
let currentTeam = 'C';
let timer;
let selectedTime = 60;
let timeLeft;
let correctCount = 0;
let passCount = 0;
let tabooCount = 0;
let gameStarted = false;
let roundCount = 1; // Kaçıncı tur olduğunu takip etmek için

// DOM elementleri
const startModal = document.getElementById('start-modal');
const endModal = document.getElementById('end-modal');
const startGameBtn = document.getElementById('start-game-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const goHomeBtn = document.getElementById('go-home-btn');
const mainWord = document.querySelector('.main-word');
const forbiddenWords = document.querySelector('.forbidden-words');
const teamCScoreDisplay = document.getElementById('team-c-score');
const teamJavaScoreDisplay = document.getElementById('team-java-score');
const timeDisplay = document.getElementById('time');
const correctCountDisplay = document.getElementById('correct-count');
const passCountDisplay = document.getElementById('pass-count');
const tabooCountDisplay = document.getElementById('taboo-count');
// Team buttons are not needed anymore

// Oyunu başlat
startGameBtn.onclick = startGame;
playAgainBtn.onclick = () => window.location.reload();
// Ana sayfaya dönüş animasyonu
function showLoadingAndNavigate(url) {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    pageLoader.classList.remove('hidden');
    pageLoader.style.display = 'flex';
    setTimeout(() => {
      window.location.href = url;
    }, 4000);
  } else {
    window.location.href = url;
  }
}

goHomeBtn.onclick = () => showLoadingAndNavigate('index.html');
document.getElementById('back-btn').onclick = () => showLoadingAndNavigate('index.html');

// Buton işlevleri
document.getElementById('correct-btn').onclick = () => handleAnswer('correct');
document.getElementById('pass-btn').onclick = () => handleAnswer('pass');
document.getElementById('taboo-btn').onclick = () => handleAnswer('taboo');
document.getElementById('next-team-btn').onclick = switchTeam;

function startGame() {
    startModal.style.display = 'none';
    gameStarted = true;
    timeLeft = selectedTime;
    currentTeam = 'C';
    document.getElementById('current-team-display').innerHTML = `
        <img src="assets/c.png" alt="C Logo" class="team-logo">
        C Takımı Oynuyor
    `;
    document.getElementById('current-team-display').className = 'team-c';
    shuffleWords();
    showNextWord();
    startTimer();
}

function shuffleWords() {
    for (let i = tabuWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tabuWords[i], tabuWords[j]] = [tabuWords[j], tabuWords[i]];
    }
    currentWordIndex = 0;
}

function showNextWord() {
    if (currentWordIndex >= tabuWords.length) {
        shuffleWords();
    }
    
    const currentWord = tabuWords[currentWordIndex];
    mainWord.textContent = currentWord.word;
    
    forbiddenWords.innerHTML = '';
    currentWord.forbidden.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'forbidden-word';
        wordElement.textContent = word;
        forbiddenWords.appendChild(wordElement);
    });
}

function handleAnswer(type) {
    if (!gameStarted) return;
    
    switch(type) {
        case 'correct':
            if (currentTeam === 'C') {
                teamCScore++;
            } else {
                teamJavaScore++;
            }
            correctCount++;
            break;
        case 'pass':
            passCount++;
            break;
        case 'taboo':
            if (currentTeam === 'C') {
                teamCScore--; // Skor eksi olabilir
            } else {
                teamJavaScore--; // Skor eksi olabilir
            }
            tabooCount++;
            break;
    }
    
    updateDisplays();
    currentWordIndex++;
    showNextWord();
}

function updateDisplays() {
    teamCScoreDisplay.textContent = teamCScore;
    teamJavaScoreDisplay.textContent = teamJavaScore;
    correctCountDisplay.textContent = correctCount;
    passCountDisplay.textContent = passCount;
    tabooCountDisplay.textContent = tabooCount;
}

function startTimer() {
    clearInterval(timer); // Önceki timer'ı temizle
    timeDisplay.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (currentTeam === 'C') { // C takımının süresi bittiyse
                showSwitchTeamModal();
            } else {
                endGame(); // Java takımının süresi bittiyse oyun biter
            }
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameStarted = false;
    
    const finalScore = document.getElementById('final-score');
    const finalStats = document.getElementById('final-stats');
    
    let winner = teamCScore > teamJavaScore ? 'C Takımı' : teamJavaScore > teamCScore ? 'Java Takımı' : 'Berabere';
    finalScore.innerHTML = `
        <div style="margin-bottom: 15px">C Takımı: ${teamCScore} | Java Takımı: ${teamJavaScore}</div>
        ${winner !== 'Berabere' ? 
            `<div style="color: #4a148c; font-size: 1.2em">Kazanan: ${winner}! 🎉</div>` : 
            '<div style="color: #4a148c">Berabere! 🤝</div>'}
    `;
    
    // Her iki takımın istatistiklerini ayrı ayrı göster
    finalStats.innerHTML = `
        <div style="margin-bottom: 10px; color: #2196f3">A Takımı İstatistikleri:</div>
        <div>Doğru: ${correctCount} | Pas: ${passCount} | Tabu: ${tabooCount}</div>
    `;
    
    endModal.style.display = 'flex';
}

// Süre seçimi için event listener'lar
document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedTime = parseInt(button.dataset.time);
    });
});

function showSwitchTeamModal() {
    const switchTeamModal = document.getElementById('switch-team-modal');
    const teamScore = document.getElementById('team-score');
    const teamStats = document.getElementById('team-stats');

    // İstatistikleri güncelle
    teamScore.textContent = `${currentTeam === 'C' ? 'C' : 'Java'} Takımının Skoru: ${currentTeam === 'C' ? teamCScore : teamJavaScore}`;
    teamStats.textContent = `Doğru: ${correctCount} | Pas: ${passCount} | Tabu: ${tabooCount}`;

    switchTeamModal.style.display = 'flex';
}

function switchTeam() {
    if (currentTeam === 'C') {
        currentTeam = 'JAVA';
        document.getElementById('current-team-display').innerHTML = `
            <img src="assets/java.png" alt="Java Logo" class="team-logo">
            Java Takımı Oynuyor
        `;
        document.getElementById('current-team-display').className = 'team-java';
    } else {
        currentTeam = 'C';
        document.getElementById('current-team-display').innerHTML = `
            <img src="assets/c.png" alt="C Logo" class="team-logo">
            C Takımı Oynuyor
        `;
        document.getElementById('current-team-display').className = 'team-c';
        roundCount++;
    }
    
    // Yeni turu başlat
    timeLeft = selectedTime;
    correctCount = 0;
    passCount = 0;
    tabooCount = 0;
    shuffleWords();
    
    // Modal'ı kapat
    document.getElementById('switch-team-modal').style.display = 'none';
    
    // Timer'ı başlat
    startTimer();
}
