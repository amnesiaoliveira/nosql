/**
 * 🎮 SISTEMA DE GAMIFICAÇÃO
 * Badges, Conquistas, Streaks e Combos
 */

export class GamificationSystem {
  constructor() {
    this.stats = {
      messagesCount: 0,
      reactionsGiven: 0,
      reactionsReceived: 0,
      streakDays: 0,
      lastMessageDate: null,
      comboCount: 0,
      maxCombo: 0,
      emojisSent: 0,
      filesSent: 0,
      nightOwlMessages: 0,  // Mensagens entre 00h-06h
      earlyBirdMessages: 0,  // Mensagens entre 05h-08h
      totalTimeInChat: 0,
    };
    
    this.badges = [];
    this.achievements = this.initAchievements();
    this.loadStats();
  }
  
  initAchievements() {
    return {
      firstMessage: {
        id: 'first_message',
        name: '🎉 Primeiro Passo',
        description: 'Enviou sua primeira mensagem',
        icon: '🎉',
        unlocked: false,
        condition: () => this.stats.messagesCount >= 1
      },
      
      chatterbox: {
        id: 'chatterbox',
        name: '💬 Tagarela',
        description: 'Enviou 100 mensagens',
        icon: '💬',
        unlocked: false,
        condition: () => this.stats.messagesCount >= 100
      },
      
      reactionKing: {
        id: 'reaction_king',
        name: '👑 Rei das Reações',
        description: 'Deu 50 reações',
        icon: '👑',
        unlocked: false,
        condition: () => this.stats.reactionsGiven >= 50
      },
      
      comboMaster: {
        id: 'combo_master',
        name: '🔥 Mestre do Combo',
        description: 'Atingiu combo de 10 mensagens',
        icon: '🔥',
        unlocked: false,
        condition: () => this.stats.maxCombo >= 10
      },
      
      emojiLover: {
        id: 'emoji_lover',
        name: '😍 Amante de Emojis',
        description: 'Enviou 200 emojis',
        icon: '😍',
        unlocked: false,
        condition: () => this.stats.emojisSent >= 200
      },
      
      nightOwl: {
        id: 'night_owl',
        name: '🦉 Coruja da Noite',
        description: 'Enviou 20 mensagens de madrugada',
        icon: '🦉',
        unlocked: false,
        condition: () => this.stats.nightOwlMessages >= 20
      },
      
      earlyBird: {
        id: 'early_bird',
        name: '🐦 Madrugador',
        description: 'Enviou 20 mensagens no amanhecer',
        icon: '🐦',
        unlocked: false,
        condition: () => this.stats.earlyBirdMessages >= 20
      },
      
      weekStreak: {
        id: 'week_streak',
        name: '⚡ Sequência de 7 Dias',
        description: 'Conversou por 7 dias seguidos',
        icon: '⚡',
        unlocked: false,
        condition: () => this.stats.streakDays >= 7
      },
      
      popular: {
        id: 'popular',
        name: '⭐ Popular',
        description: 'Recebeu 100 reações',
        icon: '⭐',
        unlocked: false,
        condition: () => this.stats.reactionsReceived >= 100
      },
      
      fileSharer: {
        id: 'file_sharer',
        name: '📎 Compartilhador',
        description: 'Enviou 20 arquivos',
        icon: '📎',
        unlocked: false,
        condition: () => this.stats.filesSent >= 20
      },
      
      speedster: {
        id: 'speedster',
        name: '⚡ Velocista',
        description: 'Enviou 5 mensagens em 10 segundos',
        icon: '⚡',
        unlocked: false,
        condition: () => this.stats.maxCombo >= 5
      },
      
      dedicated: {
        id: 'dedicated',
        name: '💎 Dedicado',
        description: 'Passou 10 horas no chat',
        icon: '💎',
        unlocked: false,
        condition: () => this.stats.totalTimeInChat >= 36000000  // 10h em ms
      },
    };
  }
  
  loadStats() {
    const saved = localStorage.getItem('chatGamificationStats');
    if (saved) {
      this.stats = { ...this.stats, ...JSON.parse(saved) };
    }
    
    const savedBadges = localStorage.getItem('chatBadges');
    if (savedBadges) {
      this.badges = JSON.parse(savedBadges);
    }
    
    const savedAchievements = localStorage.getItem('chatAchievements');
    if (savedAchievements) {
      const unlocked = JSON.parse(savedAchievements);
      Object.keys(this.achievements).forEach(key => {
        if (unlocked.includes(key)) {
          this.achievements[key].unlocked = true;
        }
      });
    }
  }
  
  saveStats() {
    localStorage.setItem('chatGamificationStats', JSON.stringify(this.stats));
    localStorage.setItem('chatBadges', JSON.stringify(this.badges));
    
    const unlockedAchievements = Object.keys(this.achievements)
      .filter(key => this.achievements[key].unlocked);
    localStorage.setItem('chatAchievements', JSON.stringify(unlockedAchievements));
  }
  
  onMessageSent() {
    this.stats.messagesCount++;
    
    // Update streak
    const today = new Date().toDateString();
    if (this.stats.lastMessageDate !== today) {
      const lastDate = new Date(this.stats.lastMessageDate);
      const todayDate = new Date();
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.stats.streakDays++;
      } else if (diffDays > 1) {
        this.stats.streakDays = 1;
      }
      
      this.stats.lastMessageDate = today;
    }
    
    // Track time of day
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      this.stats.nightOwlMessages++;
    } else if (hour >= 5 && hour < 8) {
      this.stats.earlyBirdMessages++;
    }
    
    this.checkAchievements();
    this.saveStats();
  }
  
  onReactionGiven() {
    this.stats.reactionsGiven++;
    this.checkAchievements();
    this.saveStats();
  }
  
  onReactionReceived() {
    this.stats.reactionsReceived++;
    this.checkAchievements();
    this.saveStats();
  }
  
  onEmojiSent(count = 1) {
    this.stats.emojisSent += count;
    this.checkAchievements();
    this.saveStats();
  }
  
  onFileSent() {
    this.stats.filesSent++;
    this.checkAchievements();
    this.saveStats();
  }
  
  onCombo(count) {
    this.stats.comboCount = count;
    if (count > this.stats.maxCombo) {
      this.stats.maxCombo = count;
    }
    this.checkAchievements();
    this.saveStats();
  }
  
  addTimeInChat(milliseconds) {
    this.stats.totalTimeInChat += milliseconds;
    this.saveStats();
  }
  
  checkAchievements() {
    const newUnlocks = [];
    
    Object.entries(this.achievements).forEach(([key, achievement]) => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true;
        newUnlocks.push(achievement);
        this.badges.push({
          id: achievement.id,
          name: achievement.name,
          icon: achievement.icon,
          unlockedAt: new Date().toISOString()
        });
      }
    });
    
    return newUnlocks;
  }
  
  getBadges() {
    return this.badges;
  }
  
  getStats() {
    return this.stats;
  }
  
  getLevel() {
    // Cálculo de nível baseado em XP
    const xp = this.stats.messagesCount * 10 + 
               this.stats.reactionsGiven * 5 + 
               this.stats.reactionsReceived * 5 + 
               this.stats.streakDays * 50 +
               this.badges.length * 100;
    
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }
  
  getNextLevelProgress() {
    const currentLevel = this.getLevel();
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    const currentXP = this.stats.messagesCount * 10 + 
                      this.stats.reactionsGiven * 5 + 
                      this.stats.reactionsReceived * 5 + 
                      this.stats.streakDays * 50 +
                      this.badges.length * 100;
    
    return {
      current: currentXP - xpForCurrentLevel,
      needed: xpForNextLevel - xpForCurrentLevel,
      percentage: ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    };
  }
  
  getTitleByLevel() {
    const level = this.getLevel();
    
    if (level < 5) return '🌱 Novato';
    if (level < 10) return '💬 Conversador';
    if (level < 20) return '🎭 Comunicador';
    if (level < 30) return '🎪 Entertainer';
    if (level < 50) return '⭐ Estrela';
    if (level < 75) return '👑 Lenda';
    if (level < 100) return '🔥 Mito';
    return '🌟 Deus do Chat';
  }
}

/**
 * Funções de animação para conquistas
 */
export const showAchievementNotification = (achievement) => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 z-50 glass rounded-lg p-4 shadow-2xl';
  notification.style.animation = 'slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 4.5s';
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="text-4xl">${achievement.icon}</div>
      <div>
        <div class="font-bold text-yellow-400">🏆 Conquista Desbloqueada!</div>
        <div class="text-white font-semibold">${achievement.name}</div>
        <div class="text-sm text-gray-400">${achievement.description}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Trigger confetti
  triggerMiniConfetti(notification);
  
  setTimeout(() => notification.remove(), 5000);
};

const triggerMiniConfetti = (element) => {
  const rect = element.getBoundingClientRect();
  const canvas = document.getElementById('effects-canvas');
  const ctx = canvas.getContext('2d');
  
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 3 + Math.random() * 5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      // Add particle (você precisa adaptar para seu sistema de partículas)
      // effectsSystem.addParticle(x, y, vx, vy, '#FFD700', 4, 60);
    }, i * 10);
  }
};
