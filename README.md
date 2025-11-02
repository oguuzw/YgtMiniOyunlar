# 🎮 YGT Mini Oyunlar / YGT Mini Games

Yazılım Geliştirme Topluluğu (YGT) tarafından hazırlanan, eğitim amaçlı interaktif mini oyunlar koleksiyonu.

A collection of interactive educational mini games prepared by the Software Development Community (YGT).

🌐 **Canlı Site / Live Site:** https://ygt-mini-oyunlar.gt.tc/

---

## 📚 Diller / Languages

- [🇹🇷 Türkçe](#-oyunlar) 
- [🇬🇧 English](#-games)

---

<a name="oyunlar"></a>

## 📋 Oyunlar

### 1. **Binary Search Oyunu** 🔍
Bilgisayarın ikili arama algoritmasını kullanarak 1 ile 100 arasında tuttuğunuz sayıyı bulmaya çalıştığı oyun.

**Nasıl Oynanır:**
- 1 ile 100 arasında bir sayı tutun
- Bilgisayar size sırasıyla tahminler sunacak
- Her tahminden sonra "Daha Küçük", "Doğru" veya "Daha Büyük" seçeneklerinden birini seçin
- Bilgisayar en az tahminle sayınızı bulmaya çalışacak

---

### 2. **Flow Chart Eşleştirme Oyunu** 📊
Flowchart sembollerini ve isimlerini eşleştirmeniz gereken eğitim oyunu.

**Nasıl Oynanır:**
- Soldaki flowchart sembollerini sağdaki tanımlarıyla eşleştirin
- Doğru eşleştirmeler sonucunda puan kazanın
- Tüm eşleştirmeleri tamamlayarak oyunu bitirin

---

### 3. **Tabu Oyunu** 🚫
İki takım arasında oynanan kelime anlatma oyunu.

**Nasıl Oynanır:**
- C Takımı ve Java Takımı sırayla oynar
- Her kartda bir ana kelime ve 5 yasaklı kelime bulunur
- Anlatıcı, yasaklı kelimeleri kullanmadan ana kelimeyi takım arkadaşlarına anlatmaya çalışır
- **Puanlama Sistemi:**
  - Doğru bilinen her kelime: +1 puan
  - Pas geçilen kelimeler: 0 puan
  - Yasaklı kelime kullanma: -1 puan
- Oyun süresi seçilebilir (60, 90 veya 120 saniye)

---

## 🚀 Kurulum ve Kullanım

### Gereklilikler
- Modern bir web tarayıcısı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (veya yerel olarak çalıştırma)

### Başlatma
1. Proje klasörüne gidin
2. `docs` klasöründeki `index.html` dosyasını tarayıcınızda açın
3. Oynamak istediğiniz oyunu seçin

**Ya da yerel sunucu kullanarak:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server paketi)
npx http-server
```

Daha sonra `http://localhost:8000/docs/` adresini tarayıcınızda açın.

---

## 📁 Proje Yapısı

```
docs/
├── index.html              # Ana sayfa
├── binarysearch.html       # Binary Search oyunu
├── flowchart.html          # Flow Chart oyunu
├── tabu.html               # Tabu oyunu
├── scripts/
│   ├── main.js             # Ana sayfa script
│   ├── binarysearch.js     # Binary Search oyun lojiği
│   ├── flowchart.js        # Flow Chart oyun lojiği
│   └── tabu.js             # Tabu oyun lojiği
├── styles/
│   ├── main.css            # Ana sayfa stilleri
│   ├── binarysearch.css    # Binary Search oyun stilleri
│   ├── flowchart.css       # Flow Chart oyun stilleri
│   └── tabu.css            # Tabu oyun stilleri
├── assets/                 # Resim dosyaları
└── favicon/                # Site ikonu dosyaları
```

---

## 💻 Teknolojiler

- **HTML5** - Sayfa yapısı
- **CSS3** - Tasarım ve animasyonlar
- **JavaScript (Vanilla)** - Oyun lojiği

---

## 🎨 Özellikler

✨ **Responsive Tasarım** - Mobil, tablet ve masaüstü cihazlarda çalışır  
🎯 **Kullanıcı Dostu Arayüz** - Kolay ve sezgisel kullanım  
🎮 **Eğitim Amaçlı** - Algoritma ve problem çözme becerilerini geliştirir  
⚡ **Hızlı Yükleme** - Minimal bağımlılıklar  
🔄 **Tekrar Oynanabilir** - Sınırsız oynanabilirlik  

---

## 👥 Katkıda Bulunma

Bu projeyi geliştirmeye yardımcı olmak isterseniz:

1. Projeyi fork edin
2. Özellik dalı oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişiklikleri commit edin (`git commit -m 'YeniOzellik ekle'`)
4. Dalı push edin (`git push origin feature/YeniOzellik`)
5. Pull Request açın

---

## 📝 Lisans

Bu proje Yazılım Geliştirme Topluluğu tarafından yönetilmektedir.

---

## 📧 İletişim

Sorular ve öneriler için lütfen [YGT](https://ygt.example.com) ile iletişime geçin.

🌐 **Siteyi ziyaret edin:** https://ygt-mini-oyunlar.gt.tc/

---

**Keyifli oyunlar! 🎮**

---

<a name="games"></a>

# 🇬🇧 English

A collection of interactive educational mini games prepared by the Software Development Community (YGT).

## 📋 Games

### 1. **Binary Search Game** 🔍
A game where the computer tries to find the number you're thinking of between 1 and 100 using the binary search algorithm.

**How to Play:**
- Think of a number between 1 and 100
- The computer will make guesses in sequence
- After each guess, choose one of these options: "Smaller", "Correct", or "Larger"
- The computer will try to find your number with the least number of guesses

---

### 2. **Flow Chart Matching Game** 📊
An educational game where you need to match flowchart symbols with their names.

**How to Play:**
- Match the flowchart symbols on the left with their definitions on the right
- Earn points for correct matches
- Complete all matches to finish the game

---

### 3. **Taboo Game** 🚫
A word explanation game played between two teams.

**How to Play:**
- Team C and Team Java take turns playing
- Each card contains a main word and 5 forbidden words
- The speaker tries to make their teammates guess the main word without using the forbidden words
- **Scoring System:**
  - Each correct guess: +1 point
  - Skipped words: 0 points
  - Using a forbidden word: -1 point
- Game duration can be selected (60, 90, or 120 seconds)

---

## 🚀 Installation & Usage

### Requirements
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (or run locally)

### Getting Started
1. Navigate to the project folder
2. Open the `index.html` file from the `docs` folder in your browser
3. Select the game you want to play

**Or use a local server:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server package)
npx http-server
```

Then open `http://localhost:8000/docs/` in your browser.

---

## 📁 Project Structure

```
docs/
├── index.html              # Home page
├── binarysearch.html       # Binary Search game
├── flowchart.html          # Flow Chart game
├── tabu.html               # Taboo game
├── scripts/
│   ├── main.js             # Home page script
│   ├── binarysearch.js     # Binary Search game logic
│   ├── flowchart.js        # Flow Chart game logic
│   └── tabu.js             # Taboo game logic
├── styles/
│   ├── main.css            # Home page styles
│   ├── binarysearch.css    # Binary Search game styles
│   ├── flowchart.css       # Flow Chart game styles
│   └── tabu.css            # Taboo game styles
├── assets/                 # Image files
└── favicon/                # Site icon files
```

---

## 💻 Technologies

- **HTML5** - Page structure
- **CSS3** - Design and animations
- **JavaScript (Vanilla)** - Game logic

---

## 🎨 Features

✨ **Responsive Design** - Works on mobile, tablet, and desktop devices  
🎯 **User-Friendly Interface** - Easy and intuitive to use  
🎮 **Educational Purpose** - Develops algorithm and problem-solving skills  
⚡ **Fast Loading** - Minimal dependencies  
🔄 **Replayable** - Unlimited gameplay  

---

## 👥 Contributing

If you'd like to help develop this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📝 License

This project is managed by the Software Development Community.

---

## 📧 Contact

For questions and suggestions, please contact [YGT](https://ygt.example.com).

🌐 **Visit the site:** https://ygt-mini-oyunlar.gt.tc/

---

**Enjoy the games! 🎮**
