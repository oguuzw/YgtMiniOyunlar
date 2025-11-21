// Ses Yönetici - YGT Mini Oyunlar
// Oyun sesleri için merkezi yönetim sistemi

class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.5;
    
    // LocalStorage'dan ses ayarlarını yükle
    this.loadSettings();
    
    // Sesleri tanımla (Web Audio API veya basit ses URL'leri)
    this.initSounds();
  }
  
  initSounds() {
    // Doğru cevap sesi
    this.sounds.correct = {
      url: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Success sound
      volume: 0.6
    };
    
    // Yanlış cevap sesi
    this.sounds.wrong = {
      url: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3', // Error sound
      volume: 0.5
    };
    
    // Kazanma sesi
    this.sounds.win = {
      url: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Win fanfare
      volume: 0.7
    };
    
    // Buton tıklama sesi
    this.sounds.click = {
      url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // UI click
      volume: 0.3
    };
    
    // Yeni tur sesi
    this.sounds.newRound = {
      url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3', // Notification
      volume: 0.4
    };
    
    // Hover sesi (opsiyonel)
    this.sounds.hover = {
      url: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', // Soft click
      volume: 0.2
    };
  }
  
  // Ses çal
  play(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName];
      const audio = new Audio(sound.url);
      audio.volume = (sound.volume || 0.5) * this.volume;
      audio.play().catch(err => console.log('Ses çalma hatası:', err));
    } catch (error) {
      console.log('Ses hatası:', error);
    }
  }
  
  // Sesleri aç/kapat
  toggle() {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }
  
  // Ses seviyesini ayarla (0.0 - 1.0)
  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
    this.saveSettings();
  }
  
  // Ayarları kaydet
  saveSettings() {
    localStorage.setItem('ygt-sound-enabled', this.enabled);
    localStorage.setItem('ygt-sound-volume', this.volume);
  }
  
  // Ayarları yükle
  loadSettings() {
    const enabled = localStorage.getItem('ygt-sound-enabled');
    const volume = localStorage.getItem('ygt-sound-volume');
    
    if (enabled !== null) {
      this.enabled = enabled === 'true';
    }
    
    if (volume !== null) {
      this.volume = parseFloat(volume);
    }
  }
  
  // Ses durumunu al
  isEnabled() {
    return this.enabled;
  }
  
  // Ses seviyesini al
  getVolume() {
    return this.volume;
  }
}

// Global ses yöneticisi oluştur
const soundManager = new SoundManager();

// Kullanım örnekleri:
// soundManager.play('correct');  // Doğru cevap
// soundManager.play('wrong');    // Yanlış cevap
// soundManager.play('win');      // Kazanma
// soundManager.play('click');    // Buton tıklama
// soundManager.play('newRound'); // Yeni tur
// soundManager.play('hover');    // Hover efekti
// soundManager.toggle();         // Sesleri aç/kapat
// soundManager.setVolume(0.7);   // Ses seviyesi ayarla
