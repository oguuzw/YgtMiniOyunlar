let min = 1;
let max = 100;
let guess;
let guessCount = 1;
const maxGuesses = 7;
let finished = false;
let history = [];

const guessInfo = document.getElementById('guess-info');
const guessHistory = document.getElementById('guess-history');
const gameMessage = document.getElementById('game-message');
const smallerBtn = document.getElementById('smaller-btn');
const biggerBtn = document.getElementById('bigger-btn');
const correctBtn = document.getElementById('correct-btn');
const successModal = document.getElementById('success-modal');
const modalMessage = document.getElementById('modal-message');
const playAgainBtn = document.getElementById('play-again-btn');
const goHomeBtn = document.getElementById('go-home-btn');

function makeGuess() {
  guess = Math.floor((min + max) / 2);
  guessInfo.textContent = `Sayınız ${guess} mi?`;
  history.push(guess);
  let historyText = history.map((g, index) => `Tahmin ${index + 1} = ${g}`).join('\n');
  guessHistory.style.whiteSpace = 'pre-line'; // Satır sonlarını korur
  guessHistory.textContent = historyText;
}

function endGame(msg, color = "#fff") {
  finished = true;
  gameMessage.textContent = msg;
  gameMessage.style.color = color;
  smallerBtn.disabled = true;
  biggerBtn.disabled = true;
  correctBtn.disabled = true;
}

function showSuccessModal(guessCount, guess) {
  if (guess === "Hatalı aralık") {
    modalMessage.textContent = "Hatalı bir aralık belirttiniz. Lütfen tekrar deneyin.";
  } else {
    modalMessage.textContent = `${guessCount}. tahminde ${guess} sayısı bulundu!`;
  }
  successModal.style.display = 'flex';
}

smallerBtn.onclick = () => {
  if (finished) return;
  if (guess <= min) {
    endGame("Aralık hatalı! Oyun bitti.", "#ff5252");
    showSuccessModal(guessCount, "Hatalı aralık");
    return;
  }
  max = guess - 1;
  guessCount++;
  if (guessCount > maxGuesses) {
    endGame("Tahmin hakkın bitti! Kaybettin.", "#ff5252");
    showSuccessModal(guessCount, "Tahmin hakkı bitti");
    return;
  }
  makeGuess();
};

biggerBtn.onclick = () => {
  if (finished) return;
  if (guess >= max) {
    endGame("Aralık hatalı! Oyun bitti.", "#ff5252");
    showSuccessModal(guessCount, "Hatalı aralık");
    return;
  }
  min = guess + 1;
  guessCount++;
  if (guessCount > maxGuesses) {
    endGame("Tahmin hakkın bitti! Kaybettin.", "#ff5252");
    showSuccessModal(guessCount, "Tahmin hakkı bitti");
    return;
  }
  makeGuess();
};

correctBtn.onclick = () => {
  if (finished) return;
  endGame(`Doğru bildim! Sayı: ${guess} 🎉`, "#baffc9");
  showSuccessModal(guessCount, guess);
};

playAgainBtn.onclick = () => {
  window.location.reload();
};

goHomeBtn.onclick = () => {
  window.location.href = "index.html";
};

// Welcome modal elements
const welcomeModal = document.getElementById('welcome-modal');
const startGameBtn = document.getElementById('start-game-btn');

// Hide welcome modal and start game
startGameBtn.onclick = () => {
  welcomeModal.style.display = 'none';
  makeGuess();
};

window.onload = () => {
  welcomeModal.style.display = 'flex';
  animateBinaryBackground();
};

// Binary background animation
function animateBinaryBackground() {
  const canvas = document.getElementById('binary-canvas');
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const columns = Math.floor(width / 32);
  const binaryDrops = [];
  for (let i = 0; i < columns; i++) {
    binaryDrops[i] = Math.random() * height;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.font = "24px monospace";
    ctx.fillStyle = "rgba(186,255,201,0.18)";
    for (let i = 0; i < columns; i++) {
      const text = Math.random() > 0.5 ? "0" : "1";
      ctx.fillText(text, i * 32, binaryDrops[i]);
      binaryDrops[i] += 0.6 + Math.random() * 0.3; 
      if (binaryDrops[i] > height) {
        binaryDrops[i] = 0;
      }
    }
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
}

document.getElementById('back-btn').onclick = () => {
  window.location.href = "index.html";
};