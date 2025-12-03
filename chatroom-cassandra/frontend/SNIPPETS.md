# 🔥 SNIPPETS DE CÓDIGO - COPIE E COLE

## Índice Rápido
- [Animações](#animações)
- [Efeitos de Partículas](#efeitos-de-partículas)
- [Sons](#sons)
- [Interações](#interações)
- [Easter Eggs](#easter-eggs)
- [Temas](#temas)

---

## 🎬 ANIMAÇÕES

### Bounce Animation
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.bounce-element {
  animation: bounce 0.6s ease-in-out;
}
```

### Shake Animation
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

.shake-element {
  animation: shake 0.5s;
}
```

### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 5px #C77DFF, 0 0 10px #C77DFF;
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 20px #C77DFF, 0 0 40px #C77DFF;
    transform: scale(1.05);
  }
}

.pulse-element {
  animation: pulse-glow 2s infinite;
}
```

### Slide In From Right
```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-right {
  animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Fade In Scale
```css
@keyframes fadeInScale {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-scale {
  animation: fadeInScale 0.3s ease-out;
}
```

---

## ✨ EFEITOS DE PARTÍCULAS

### Sistema de Partículas Simples
```javascript
class SimpleParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  emit(x, y, count = 50, color = '#FFD700') {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        size: Math.random() * 5 + 2,
        life: 100,
        color: color,
        gravity: 0.2
      });
    }
  }
  
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      
      this.ctx.globalAlpha = p.life / 100;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      return p.life > 0;
    });
    
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.update());
  }
}

// Uso:
const particles = new SimpleParticleSystem('canvas-id');
particles.update();
particles.emit(window.innerWidth / 2, window.innerHeight / 2, 100, '#FF00FF');
```

### Confete Explosivo
```javascript
function explodeConfetti(x, y) {
  const colors = ['#FF006E', '#FFB627', '#CAFFBF', '#C77DFF', '#7B68EE'];
  const count = 100;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-piece';
    particle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 5 + Math.random() * 10;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 10;
    
    let posX = x, posY = y, gravity = 0.5, life = 100;
    
    const animate = () => {
      posX += vx;
      posY += vy + gravity;
      gravity += 0.1;
      life--;
      
      particle.style.left = posX + 'px';
      particle.style.top = posY + 'px';
      particle.style.opacity = life / 100;
      particle.style.transform = `rotate(${360 - life * 3.6}deg)`;
      
      if (life > 0) requestAnimationFrame(animate);
      else particle.remove();
    };
    
    animate();
  }
}

// Uso:
explodeConfetti(window.innerWidth / 2, window.innerHeight / 2);
```

### Chuva de Emojis
```javascript
function emojiRain(emoji = '❤️', duration = 5000) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9998;
  `;
  
  document.body.appendChild(container);
  
  const interval = setInterval(() => {
    const drop = document.createElement('div');
    drop.textContent = emoji;
    drop.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: -50px;
      font-size: ${Math.random() * 30 + 20}px;
      animation: fall ${Math.random() * 2 + 3}s linear;
      opacity: ${Math.random() * 0.5 + 0.5};
    `;
    
    container.appendChild(drop);
    
    setTimeout(() => drop.remove(), 5000);
  }, 100);
  
  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => container.remove(), 5000);
  }, duration);
}

// CSS necessário:
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fall {
    to { transform: translateY(100vh) rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Uso:
emojiRain('🎉', 5000);
```

---

## 🎵 SONS

### Gerador de Sons
```javascript
class SoundGenerator {
  constructor() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  play(frequency, duration, type = 'sine', volume = 0.3) {
    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    
    oscillator.start(this.audioCtx.currentTime);
    oscillator.stop(this.audioCtx.currentTime + duration);
  }
  
  // Sons pré-definidos
  success() {
    this.play(523.25, 0.1);
    setTimeout(() => this.play(659.25, 0.1), 100);
    setTimeout(() => this.play(783.99, 0.2), 200);
  }
  
  error() {
    this.play(200, 0.3, 'square', 0.2);
  }
  
  notification() {
    this.play(800, 0.1);
    setTimeout(() => this.play(600, 0.15), 150);
  }
  
  click() {
    this.play(1000, 0.05, 'square', 0.1);
  }
  
  whoosh() {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.frequency.setValueAtTime(1000, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
    
    osc.start(this.audioCtx.currentTime);
    osc.stop(this.audioCtx.currentTime + 0.3);
  }
}

// Uso:
const sounds = new SoundGenerator();
sounds.success();
sounds.notification();
sounds.whoosh();
```

---

## 🎮 INTERAÇÕES

### Long Press Detector
```javascript
class LongPressDetector {
  constructor(element, callback, duration = 500) {
    this.element = element;
    this.callback = callback;
    this.duration = duration;
    this.timer = null;
    
    this.element.addEventListener('mousedown', () => this.start());
    this.element.addEventListener('mouseup', () => this.cancel());
    this.element.addEventListener('mouseleave', () => this.cancel());
    
    this.element.addEventListener('touchstart', () => this.start());
    this.element.addEventListener('touchend', () => this.cancel());
    this.element.addEventListener('touchcancel', () => this.cancel());
  }
  
  start() {
    this.timer = setTimeout(() => {
      this.callback();
      this.timer = null;
    }, this.duration);
  }
  
  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// Uso:
const element = document.querySelector('.message');
new LongPressDetector(element, () => {
  console.log('Long press detected!');
  // Mostrar menu de reações
}, 500);
```

### Shake to Activate
```javascript
class ShakeDetector {
  constructor(callback, threshold = 15) {
    this.callback = callback;
    this.threshold = threshold;
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
    
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => this.handleMotion(e));
    }
  }
  
  handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    
    if (this.lastX !== null) {
      const deltaX = Math.abs(acc.x - this.lastX);
      const deltaY = Math.abs(acc.y - this.lastY);
      const deltaZ = Math.abs(acc.z - this.lastZ);
      
      if (deltaX + deltaY + deltaZ > this.threshold) {
        this.callback();
      }
    }
    
    this.lastX = acc.x;
    this.lastY = acc.y;
    this.lastZ = acc.z;
  }
}

// Uso:
new ShakeDetector(() => {
  console.log('Device shaken!');
  triggerConfetti();
}, 15);
```

### Double Click/Tap Handler
```javascript
class DoubleTapDetector {
  constructor(element, callback, delay = 300) {
    this.element = element;
    this.callback = callback;
    this.delay = delay;
    this.lastTap = 0;
    
    this.element.addEventListener('click', () => this.handleTap());
  }
  
  handleTap() {
    const now = Date.now();
    
    if (now - this.lastTap < this.delay) {
      this.callback();
      this.lastTap = 0;
    } else {
      this.lastTap = now;
    }
  }
}

// Uso:
const message = document.querySelector('.message');
new DoubleTapDetector(message, () => {
  console.log('Double tapped!');
  // Adicionar reação automática
}, 300);
```

---

## 🎪 EASTER EGGS

### Konami Code Detector
```javascript
class KonamiCodeDetector {
  constructor(callback) {
    this.callback = callback;
    this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.progress = [];
    
    window.addEventListener('keydown', (e) => this.handleKey(e.key));
  }
  
  handleKey(key) {
    this.progress.push(key);
    this.progress = this.progress.slice(-10);
    
    if (this.progress.join(',') === this.sequence.join(',')) {
      this.callback();
      this.progress = [];
    }
  }
}

// Uso:
new KonamiCodeDetector(() => {
  console.log('KONAMI CODE!');
  // Trigger efeito especial
});
```

### Secret Word Detector
```javascript
class SecretWordDetector {
  constructor(words, callback) {
    this.words = words; // { 'secret': () => {}, 'magic': () => {} }
    this.buffer = '';
    
    window.addEventListener('keypress', (e) => this.handleKey(e.key));
  }
  
  handleKey(key) {
    this.buffer += key.toLowerCase();
    this.buffer = this.buffer.slice(-20);
    
    Object.entries(this.words).forEach(([word, callback]) => {
      if (this.buffer.includes(word)) {
        callback();
        this.buffer = '';
      }
    });
  }
}

// Uso:
new SecretWordDetector({
  'magic': () => console.log('Magic word!'),
  'secret': () => console.log('Secret word!'),
  'hack': () => triggerMatrixEffect()
});
```

### Time-Based Easter Egg
```javascript
function checkTimeEasterEggs() {
  const hour = new Date().getHours();
  
  if (hour === 0 && new Date().getMinutes() === 0) {
    // Meia-noite
    document.body.style.animation = 'midnight 5s';
  } else if (hour === 12 && new Date().getMinutes() === 0) {
    // Meio-dia
    document.body.style.animation = 'noon 5s';
  } else if (hour === 13 && new Date().getMinutes() === 37) {
    // 13:37 (leet speak)
    showMessage('1337 H4X0R!');
  }
}

// Check every minute
setInterval(checkTimeEasterEggs, 60000);
```

---

## 🎨 TEMAS

### Theme Manager Class
```javascript
class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        '--bg': '#0D0D0D',
        '--text': '#FFFFFF',
        '--accent': '#C77DFF'
      },
      light: {
        '--bg': '#FFFFFF',
        '--text': '#000000',
        '--accent': '#7B68EE'
      }
    };
    
    this.loadTheme();
  }
  
  apply(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;
    
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    localStorage.setItem('theme', themeName);
  }
  
  loadTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    this.apply(saved);
  }
  
  toggle() {
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }
}

// Uso:
const themeManager = new ThemeManager();
themeManager.apply('dark');
themeManager.toggle();
```

### Gradient Generator
```javascript
function generateGradient(color1, color2, angle = 135) {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

// Uso:
element.style.background = generateGradient('#FF00FF', '#00FFFF', 45);
```

---

## 💾 SALVAR/CARREGAR

### LocalStorage Helper
```javascript
class Storage {
  static save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  static load(key, defaultValue = null) {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }
  
  static remove(key) {
    localStorage.removeItem(key);
  }
  
  static clear() {
    localStorage.clear();
  }
}

// Uso:
Storage.save('user', { name: 'João', level: 5 });
const user = Storage.load('user');
```

---

## 🎯 UTILITÁRIOS

### Random Color Generator
```javascript
function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function randomHSL() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}
```

### Debounce Function
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Uso:
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);
```

### Throttle Function
```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Uso:
const throttledScroll = throttle(() => {
  console.log('Scrolling...');
}, 100);
```

---

**🚀 AGORA É SÓ COPIAR E USAR!**
