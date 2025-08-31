const flowchartItems = [
    { key: "basla", img: "assets/start.png", name: "Başla" },
    { key: "islem", img: "assets/islem.png", name: "İşlem" },
    { key: "in", img: "assets/in.png", name: "Giriş" },
    { key: "out", img: "assets/out.png", name: "Çıktı" },
    { key: "j", img: "assets/j.png", name: "Karar" },
    { key: "baglanti", img: "assets/baglanti.png", name: "Bağlantı" },
    { key: "end", img: "assets/end.png", name: "Bitiş" }
];

let score = 0;
let selectedImage = null;
let selectedName = null;
let matched = {};
let totalMatches = flowchartItems.length;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function renderBoxes() {
    const imageBoxes = document.getElementById('image-boxes');
    const nameBoxes = document.getElementById('name-boxes');
    imageBoxes.innerHTML = '';
    nameBoxes.innerHTML = '';

    flowchartItems.forEach(item => {
        const imgBox = document.createElement('div');
        imgBox.className = 'box image-box';
        imgBox.dataset.key = item.key;
        imgBox.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
        imgBox.onclick = () => selectImageBox(imgBox);
        imageBoxes.appendChild(imgBox);
    });

    shuffle([...flowchartItems]).forEach(item => {
        const nameBox = document.createElement('div');
        nameBox.className = 'box name-box';
        nameBox.dataset.key = item.key;
        nameBox.textContent = item.name;
        nameBox.onclick = () => selectNameBox(nameBox);
        nameBoxes.appendChild(nameBox);
    });
}

function selectImageBox(box) {
    if (matched[box.dataset.key]) return;
    document.querySelectorAll('.image-box').forEach(b => b.classList.remove('selected'));
    box.classList.add('selected');
    selectedImage = box;
    checkMatch();
}

function selectNameBox(box) {
    if (matched[box.dataset.key]) return;
    document.querySelectorAll('.name-box').forEach(b => b.classList.remove('selected'));
    box.classList.add('selected');
    selectedName = box;
    checkMatch();
}

function checkMatch() {
    if (selectedImage && selectedName) {
        if (selectedImage.dataset.key === selectedName.dataset.key) {
            selectedImage.classList.add('correct');
            selectedName.classList.add('correct');
            matched[selectedImage.dataset.key] = true;
            score += 20;
            document.getElementById('score').textContent = `Puan: ${score}`;
            selectedImage.classList.remove('selected');
            selectedName.classList.remove('selected');
            selectedImage = null;
            selectedName = null;
            if (Object.keys(matched).length === totalMatches) {
                setTimeout(showEndScreen, 700);
            }
        } else {
            score -= 10;
            document.getElementById('score').textContent = `Puan: ${score}`;
            selectedImage.classList.add('wrong');
            selectedName.classList.add('wrong');
            setTimeout(() => {
                selectedImage.classList.remove('wrong', 'selected');
                selectedName.classList.remove('wrong', 'selected');
                selectedImage = null;
                selectedName = null;
            }, 600);
        }
    }
}

function showEndScreen() {
    document.getElementById('game-end').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Toplam Puan: ${score}`;
}

function restartGame() {
    score = 0;
    matched = {};
    selectedImage = null;
    selectedName = null;
    document.getElementById('score').textContent = `Puan: 0`;
    document.getElementById('game-end').classList.add('hidden');
    renderBoxes();
}

// Geometrik şekillerin arka planda hareket etmesi
const shapes = [
    { class: 'bg-oval' },
    { class: 'bg-rect' },
    { class: 'bg-parallelogram' },
    { class: 'bg-diamond' },
    { class: 'bg-oval' },
    { class: 'bg-rect' },
    { class: 'bg-parallelogram' }
];

function createBgShapes() {
    const container = document.querySelector('.flowchart-bg-shapes');
    container.innerHTML = '';
    shapes.forEach((shape, i) => {
        const el = document.createElement('div');
        el.className = `bg-shape ${shape.class}`;
        el.style.top = (10 + i * 12 + Math.random() * 10) + 'vh';
        el.style.left = (10 + i * 13 + Math.random() * 10) + 'vw';
        // Daha yavaş hareket için dx ve dy değerlerini küçült
        el.dataset.dx = (Math.random() * 0.12 + 0.04).toFixed(3); // 0.04 - 0.16
        el.dataset.dy = (Math.random() * 0.12 + 0.04).toFixed(3);
        el.dataset.dir = Math.random() > 0.5 ? 1 : -1;
        // Rastgele faz ekle
        el.dataset.phase = (Math.random() * Math.PI * 2).toFixed(3);
        container.appendChild(el);
    });
}

function animateBgShapes() {
    document.querySelectorAll('.bg-shape').forEach((el, i) => {
        let top = parseFloat(el.style.top);
        let left = parseFloat(el.style.left);
        let dx = parseFloat(el.dataset.dx);
        let dy = parseFloat(el.dataset.dy);
        let dir = parseInt(el.dataset.dir);
        let phase = parseFloat(el.dataset.phase);

        // Daha yavaş ve rastgele hareket için katsayıları büyüt
        const t = Date.now() / 40000 + phase; // 40000 ile yavaşlat
        top += Math.sin(t + i) * dy * dir;
        left += Math.cos(t + i * 1.3) * dx * dir;

        // Sınırları koru
        top = Math.max(0, Math.min(90, top));
        left = Math.max(0, Math.min(90, left));

        el.style.top = top + 'vh';
        el.style.left = left + 'vw';

        // Hareketi zamanla biraz değiştir (daha doğal rastgelelik)
        if (Math.random() < 0.01) {
            el.dataset.dx = (Math.random() * 0.12 + 0.04).toFixed(3);
            el.dataset.dy = (Math.random() * 0.12 + 0.04).toFixed(3);
            el.dataset.dir = Math.random() > 0.5 ? 1 : -1;
        }
    });
    requestAnimationFrame(animateBgShapes);
}

window.onload = function() {
    renderBoxes();
    createBgShapes();
    animateBgShapes();
};

document.getElementById('home-btn').onclick = function() {
    window.location.href = 'index.html'; // Gerekirse yolu değiştirin
};