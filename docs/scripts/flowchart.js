// Semboller ve isimler eşleştirme verisi
const pairs = [
  { img: 'assets/start.png', word: 'Başla' },
  { img: 'assets/islem.png', word: 'İşlem' },
  { img: 'assets/in.png', word: 'Giriş' },
  { img: 'assets/out.png', word: 'Çıktı' },
  { img: 'assets/j.png', word: 'Karar' },
  { img: 'assets/baglanti.png', word: 'Bağlantı' },
  { img: 'assets/end.png', word: 'Bitiş' }
];

// DOM referansları
const symbolsDiv = document.getElementById('symbols');
const namesDiv = document.getElementById('names');
const scoreSpan = document.getElementById('score');
const backBtn = document.getElementById('back-btn');

// Oyun durumu
let score = 0;
let selectedSymbol = null;
let selectedName = null;
let matched = {}; // {symbolIndex: true, ...}

// Karıştırma fonksiyonu
function shuffle(arr) {
  return arr.map(v => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map(v => v[1]);
}

// Kutuları oluştur
function renderItems() {
  symbolsDiv.innerHTML = '';
  namesDiv.innerHTML = '';
  const symbolOrder = shuffle([...Array(pairs.length).keys()]);
  const nameOrder = shuffle([...Array(pairs.length).keys()]);

  symbolOrder.forEach(i => {
    const box = document.createElement('div');
    box.className = 'item-box symbol-box';
    box.dataset.index = i;
    box.innerHTML = `<img src="${pairs[i].img}" alt="Sembol">`;
    box.addEventListener('click', () => selectSymbol(box, i));
    symbolsDiv.appendChild(box);
  });

  nameOrder.forEach(i => {
    const box = document.createElement('div');
    box.className = 'item-box name-box';
    box.dataset.index = i;
    box.innerHTML = `<span class="word">${pairs[i].word}</span>`;
    box.addEventListener('click', () => selectName(box, i));
    namesDiv.appendChild(box);
  });
}

// Seçim fonksiyonları
function selectSymbol(box, idx) {
  if (matched[idx]) return;
  clearSelections('symbol');
  box.classList.add('selected');
  selectedSymbol = { box, idx };
  tryMatch();
}
function selectName(box, idx) {
  if (matched[idx]) return;
  clearSelections('name');
  box.classList.add('selected');
  selectedName = { box, idx };
  tryMatch();
}
function clearSelections(type) {
  document.querySelectorAll('.symbol-box.selected').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.name-box.selected').forEach(b => b.classList.remove('selected'));
  if (type === 'symbol') selectedSymbol = null;
  if (type === 'name') selectedName = null;
}

// Eşleştirme kontrolü
function tryMatch() {
  if (selectedSymbol && selectedName) {
    if (selectedSymbol.idx === selectedName.idx) {
      // Doğru eşleşme
      selectedSymbol.box.classList.add('correct');
      selectedName.box.classList.add('correct');
      matched[selectedSymbol.idx] = true;
      score += 20;
      updateScore();
      setTimeout(() => {
        selectedSymbol.box.classList.remove('selected');
        selectedName.box.classList.remove('selected');
        selectedSymbol = null;
        selectedName = null;
        if (Object.keys(matched).length === pairs.length) {
          setTimeout(showModal, 400); // Modalı göster
        }
      }, 600);
    } else {
      // Yanlış eşleşme
      selectedSymbol.box.classList.add('wrong');
      selectedName.box.classList.add('wrong');
      score -= 10;
      updateScore();
      setTimeout(() => {
        selectedSymbol.box.classList.remove('wrong', 'selected');
        selectedName.box.classList.remove('wrong', 'selected');
        selectedSymbol = null;
        selectedName = null;
      }, 600);
    }
  }
}

// Skor güncelle
function updateScore() {
  scoreSpan.textContent = score;
}

// Geri butonu
backBtn.addEventListener('click', () => {
  window.location.href = "index.html";
});

// Modal ekranı ekle
function createModal() {
  let modal = document.getElementById('finish-modal');
  if (modal) return; // Zaten varsa tekrar ekleme

  modal = document.createElement('div');
  modal.id = 'finish-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Tebrikler!</h2>
      <p>Puanınız: <span id="final-score"></span></p>
      <div class="modal-buttons">
        <button id="home-btn">Ana Sayfa</button>
        <button id="retry-btn">Tekrar Oyna</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Butonlara event ekle
  document.getElementById('home-btn').onclick = () => {
    window.location.href = "index.html";
  };
  document.getElementById('retry-btn').onclick = () => {
    modal.style.display = 'none';
    score = 0;
    matched = {};
    updateScore();
    renderItems();
  };
}

// Modalı göster
function showModal() {
  createModal();
  document.getElementById('final-score').textContent = score;
  document.getElementById('finish-modal').style.display = 'flex';
}

// Başlat
renderItems();
createModal(); // Modalı başta oluştur, gizli kalsın

// Modal CSS'i ekle
const modalStyle = document.createElement('style');
modalStyle.textContent = `
#finish-modal {
  display: none;
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: rgba(0,0,0,0.45);
  align-items: center;
  justify-content: center;
}
#finish-modal .modal-content {
  background: #fffbe9;
  border-radius: 18px;
  padding: 32px 24px 24px 24px;
  box-shadow: 0 4px 32px #ff7e5f44;
  text-align: center;
  min-width: 240px;
  max-width: 90vw;
}
#finish-modal h2 {
  color: #ff7e5f;
  margin-bottom: 12px;
}
#finish-modal p {
  font-size: 1.2em;
  margin-bottom: 22px;
}
#finish-modal .modal-buttons {
  display: flex;
  gap: 18px;
  justify-content: center;
}
#finish-modal button {
  background: linear-gradient(90deg, #ffb347 0%, #ff7e5f 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
#finish-modal button:hover {
  background: linear-gradient(90deg, #ff7e5f 0%, #ffb347 100%);
}
`;
document.head.appendChild(modalStyle);