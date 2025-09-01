// Modern hareketli yazılım-bilgisayar efektleri
const symbols = ['{', '}', ';', '()', '[]', '&&', '||', '!', '=','*', 'void', 'if','else','int','bool'];
const codeEffects = document.getElementById('code-effects');

function createSymbol() {
    const el = document.createElement('span');
    el.className = 'code-symbol';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = (10 + Math.random() * 80) + 'vh';
    el.style.fontSize = (1.3 + Math.random() * 1.7) + 'rem';
    el.style.animationDuration = (15 + Math.random() * 6) + 's'; // daha yavaş
    el.style.color = Math.random() > 0.5 ? '#ff003c' : '#005aff';
    codeEffects.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 22000);
}

// Sayfa açılır açılmaz başlangıçta 20 sembol oluştur
for (let i = 0; i < 20; i++) {
    createSymbol();
}

// Daha sık sembol oluştur
setInterval(createSymbol, 350);