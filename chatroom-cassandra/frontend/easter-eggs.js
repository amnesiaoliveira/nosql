/**
 * 🎪 EASTER EGGS & COMANDOS ESPECIAIS
 * Surpresas e funcionalidades escondidas
 */

export class EasterEggSystem {
  constructor() {
    this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiProgress = [];
    this.secretCommands = this.initSecretCommands();
    this.setupListeners();
  }
  
  initSecretCommands() {
    return {
      '/tts': {
        description: 'Text-to-Speech',
        execute: (text) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'pt-BR';
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
          return { success: true, message: '🔊 Falando...' };
        }
      },
      
      '/god': {
        description: 'Modo Deus',
        execute: () => {
          document.body.style.filter = 'hue-rotate(360deg)';
          document.body.style.animation = 'rainbow 2s infinite';
          
          const style = document.createElement('style');
          style.innerHTML = `
            @keyframes rainbow {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(360deg); }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            document.body.style.filter = '';
            document.body.style.animation = '';
          }, 10000);
          
          return { success: true, message: '👑 MODO DEUS ATIVADO POR 10 SEGUNDOS!' };
        }
      },
      
      '/disco': {
        description: 'Modo Festa',
        execute: () => {
          const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
          let i = 0;
          
          const interval = setInterval(() => {
            document.body.style.background = colors[i % colors.length];
            i++;
          }, 200);
          
          setTimeout(() => {
            clearInterval(interval);
            document.body.style.background = 'var(--bg-dark)';
          }, 5000);
          
          return { success: true, message: '🪩 DISCO TIME!' };
        }
      },
      
      '/matrix': {
        description: 'Efeito Matrix',
        execute: () => {
          this.matrixRain();
          return { success: true, message: '💚 Wake up, Neo...' };
        }
      },
      
      '/nuke': {
        description: 'Explosão Nuclear',
        execute: () => {
          this.nuclearExplosion();
          return { success: true, message: '💣 KABOOM!' };
        }
      },
      
      '/gravity': {
        description: 'Inverte a gravidade',
        execute: () => {
          document.body.style.transform = 'rotate(180deg)';
          document.body.style.transition = 'transform 1s';
          
          setTimeout(() => {
            document.body.style.transform = '';
          }, 5000);
          
          return { success: true, message: '🌀 Gravidade invertida!' };
        }
      },
      
      '/ghost': {
        description: 'Modo Fantasma',
        execute: () => {
          document.body.style.opacity = '0.3';
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 5000);
          
          return { success: true, message: '👻 Você virou um fantasma!' };
        }
      },
      
      '/trippy': {
        description: 'Efeito Psicodélico',
        execute: () => {
          document.body.style.animation = 'trippy 0.5s infinite';
          
          const style = document.createElement('style');
          style.innerHTML = `
            @keyframes trippy {
              0% { filter: hue-rotate(0deg) contrast(100%) brightness(100%); }
              25% { filter: hue-rotate(90deg) contrast(150%) brightness(120%); }
              50% { filter: hue-rotate(180deg) contrast(100%) brightness(100%); }
              75% { filter: hue-rotate(270deg) contrast(150%) brightness(120%); }
              100% { filter: hue-rotate(360deg) contrast(100%) brightness(100%); }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            document.body.style.animation = '';
            document.body.style.filter = '';
          }, 10000);
          
          return { success: true, message: '🌈 Modo psicodélico ativado!' };
        }
      },
      
      '/snow': {
        description: 'Neve caindo',
        execute: () => {
          this.createSnowfall();
          return { success: true, message: '❄️ Let it snow!' };
        }
      },
      
      '/earthquake': {
        description: 'Terremoto',
        execute: () => {
          document.body.style.animation = 'earthquake 0.5s 10';
          
          const style = document.createElement('style');
          style.innerHTML = `
            @keyframes earthquake {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              10% { transform: translate(-10px, 5px) rotate(-2deg); }
              20% { transform: translate(10px, -5px) rotate(2deg); }
              30% { transform: translate(-5px, 10px) rotate(-1deg); }
              40% { transform: translate(5px, -10px) rotate(1deg); }
              50% { transform: translate(-10px, -5px) rotate(-2deg); }
              60% { transform: translate(10px, 5px) rotate(2deg); }
              70% { transform: translate(-5px, -10px) rotate(-1deg); }
              80% { transform: translate(5px, 10px) rotate(1deg); }
              90% { transform: translate(-10px, 5px) rotate(-2deg); }
            }
          `;
          document.head.appendChild(style);
          
          setTimeout(() => {
            document.body.style.animation = '';
          }, 5000);
          
          return { success: true, message: '🌍 TERREMOTO!' };
        }
      },
      
      '/help': {
        description: 'Lista todos os comandos',
        execute: () => {
          const commands = Object.keys(this.secretCommands).join(', ');
          return { success: true, message: `📝 Comandos disponíveis: ${commands}` };
        }
      }
    };
  }
  
  setupListeners() {
    // Konami Code
    window.addEventListener('keydown', (e) => {
      this.konamiProgress.push(e.key);
      this.konamiProgress = this.konamiProgress.slice(-10);
      
      if (this.konamiProgress.join(',') === this.konamiCode.join(',')) {
        this.triggerKonamiEffect();
        this.konamiProgress = [];
      }
    });
  }
  
  executeCommand(message) {
    const parts = message.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    if (this.secretCommands[command]) {
      return this.secretCommands[command].execute(args);
    }
    
    return null;
  }
  
  triggerKonamiEffect() {
    // Explosão de unicórnios arco-íris
    const canvas = document.getElementById('effects-canvas');
    const ctx = canvas.getContext('2d');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create rainbow explosion
    for (let i = 0; i < 500; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * Math.random());
        const velocity = 5 + Math.random() * 20;
        const hue = Math.random() * 360;
        
        this.addRainbowParticle(centerX, centerY, angle, velocity, hue);
      }, i * 5);
    }
    
    // Play sound
    this.playKonamiSound();
    
    // Show message
    this.showBigMessage('🦄 KONAMI CODE! 🦄');
  }
  
  addRainbowParticle(x, y, angle, velocity, hue) {
    // Você precisa integrar isso com seu sistema de partículas
    // Este é um exemplo simplificado
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.background = `hsl(${hue}, 100%, 60%)`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let posX = x;
    let posY = y;
    let life = 100;
    
    const animate = () => {
      posX += vx;
      posY += vy + (100 - life) * 0.1;  // gravity
      life--;
      
      particle.style.left = posX + 'px';
      particle.style.top = posY + 'px';
      particle.style.opacity = life / 100;
      
      if (life > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };
    
    animate();
  }
  
  playKonamiSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99];
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      }, i * 150);
    });
  }
  
  showBigMessage(text) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';
    overlay.style.pointerEvents = 'none';
    overlay.style.animation = 'bigMessageFade 3s ease-out';
    
    const message = document.createElement('div');
    message.style.fontSize = '72px';
    message.style.fontWeight = 'bold';
    message.style.color = 'white';
    message.style.textShadow = '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.6)';
    message.style.animation = 'bigMessageScale 3s ease-out';
    message.textContent = text;
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes bigMessageFade {
        0% { opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      @keyframes bigMessageScale {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => overlay.remove(), 3000);
  }
  
  matrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '9998';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let frame = 0;
    const maxFrames = 300;
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
      
      frame++;
      
      if (frame < maxFrames) {
        requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    };
    
    draw();
  }
  
  nuclearExplosion() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.background = 'white';
    overlay.style.animation = 'nuclearFlash 2s ease-out';
    
    document.body.appendChild(overlay);
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes nuclearFlash {
        0% { opacity: 0; transform: scale(0); }
        10% { opacity: 1; transform: scale(1); background: white; }
        30% { background: orange; }
        50% { background: red; }
        70% { background: rgba(255, 0, 0, 0.5); }
        100% { opacity: 0; transform: scale(10); }
      }
    `;
    document.head.appendChild(style);
    
    // Screen shake
    document.body.style.animation = 'earthquake 0.5s 20';
    
    setTimeout(() => {
      overlay.remove();
      document.body.style.animation = '';
    }, 2000);
  }
  
  createSnowfall() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9998';
    
    for (let i = 0; i < 100; i++) {
      const snowflake = document.createElement('div');
      snowflake.innerHTML = '❄️';
      snowflake.style.position = 'absolute';
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.top = '-20px';
      snowflake.style.fontSize = (Math.random() * 20 + 10) + 'px';
      snowflake.style.opacity = Math.random();
      snowflake.style.animation = `snowfall ${Math.random() * 3 + 2}s linear infinite`;
      snowflake.style.animationDelay = Math.random() * 2 + 's';
      
      container.appendChild(snowflake);
    }
    
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes snowfall {
        to {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(container);
    
    setTimeout(() => container.remove(), 10000);
  }
}

// Export singleton
export const easterEggs = new EasterEggSystem();
