/**
 * 🎨 COMPONENTES REACT REUTILIZÁVEIS
 * Copie e cole estes componentes no seu projeto
 */

import React, { useState, useEffect, useRef } from 'react';

// ========== 1. EMOJI PICKER COMPONENT ==========
export const EmojiPicker = ({ onSelect, onClose }) => {
  const emojis = [
    { category: 'Smileys', items: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'] },
    { category: 'Gestos', items: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚'] },
    { category: 'Corações', items: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'] },
    { category: 'Objetos', items: ['🔥', '⚡', '💥', '✨', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💫', '🌈', '☀️', '🌙'] },
  ];
  
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const pickerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  const filteredEmojis = searchTerm 
    ? emojis.flatMap(cat => cat.items).filter(e => e.includes(searchTerm))
    : emojis[activeCategory].items;
  
  return (
    <div 
      ref={pickerRef}
      className="absolute bottom-full mb-2 glass rounded-2xl p-4 w-80 shadow-2xl z-50"
      style={{ animation: 'slideUp 0.3s ease-out' }}
    >
      {/* Search */}
      <input
        type="text"
        placeholder="Buscar emoji..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      
      {/* Categories */}
      {!searchTerm && (
        <div className="flex space-x-2 mb-3 overflow-x-auto">
          {emojis.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(i)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === i 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      )}
      
      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
        {filteredEmojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => {
              onSelect(emoji);
              onClose?.();
            }}
            className="text-2xl hover:scale-125 transition-transform duration-200 hover:bg-white/10 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// ========== 2. FLOATING BADGE COMPONENT ==========
export const FloatingBadge = ({ text, icon, color = 'purple', duration = 3000, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);
  
  return (
    <div
      className={`fixed top-20 right-4 z-50 glass rounded-full px-6 py-3 shadow-2xl flex items-center space-x-2`}
      style={{ animation: 'badgeSlideIn 0.5s ease-out, badgeSlideOut 0.5s ease-out 2.5s' }}
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-xs text-gray-400 uppercase">Conquista!</div>
        <div className={`font-bold text-${color}-400`}>{text}</div>
      </div>
    </div>
  );
};

// ========== 3. COMBO DISPLAY COMPONENT ==========
export const ComboDisplay = ({ count, maxCombo }) => {
  const isOnFire = count > 5;
  
  if (count < 2) return null;
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className={`glass rounded-full px-8 py-4 shadow-2xl ${isOnFire ? 'fire-effect' : ''}`}
        style={{ animation: 'bounce 0.5s ease-out' }}
      >
        <div className="text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {count}x COMBO
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {isOnFire ? '🔥 VOCÊ TÁ PEGANDO FOGO! 🔥' : 'Continue mandando mensagens!'}
          </div>
          {maxCombo > count && (
            <div className="text-xs text-purple-400 mt-1">
              Recorde: {maxCombo}x
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== 4. TYPING INDICATOR COMPONENT ==========
export const TypingIndicator = ({ users, position = 'inline' }) => {
  if (!users || users.length === 0) return null;
  
  const displayText = users.length === 1 
    ? `${users[0]} está digitando` 
    : `${users.length} pessoas estão digitando`;
  
  return (
    <div className={`flex items-center space-x-3 ${position === 'inline' ? 'mb-4' : ''}`}>
      <div className="flex items-center space-x-1">
        <div className="typing-dot w-2 h-2 bg-purple-400 rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="typing-dot w-2 h-2 bg-pink-400 rounded-full"></div>
      </div>
      <span className="text-sm text-gray-400">{displayText}</span>
    </div>
  );
};

// ========== 5. STATS CARD COMPONENT ==========
export const StatsCard = ({ stats }) => {
  const level = Math.floor(Math.sqrt((stats.messagesCount * 10 + stats.reactionsGiven * 5) / 100)) + 1;
  
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Suas Estatísticas
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-3xl font-bold text-white">{stats.messagesCount}</div>
          <div className="text-xs text-gray-400">Mensagens</div>
        </div>
        
        <div>
          <div className="text-3xl font-bold text-pink-400">{stats.reactionsGiven}</div>
          <div className="text-xs text-gray-400">Reações Dadas</div>
        </div>
        
        <div>
          <div className="text-3xl font-bold text-yellow-400">{stats.streakDays}</div>
          <div className="text-xs text-gray-400">Dias de Streak</div>
        </div>
        
        <div>
          <div className="text-3xl font-bold text-purple-400">Nv. {level}</div>
          <div className="text-xs text-gray-400">Seu Nível</div>
        </div>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(stats.messagesCount % 100)}%` }}
        ></div>
      </div>
      <div className="text-xs text-center text-gray-400">
        {100 - (stats.messagesCount % 100)} mensagens para o próximo nível
      </div>
    </div>
  );
};

// ========== 6. MESSAGE WITH REACTIONS COMPONENT ==========
export const MessageBubble = ({ 
  message, 
  isMine, 
  onReact, 
  onLongPress 
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  
  const handlePressStart = () => {
    const timer = setTimeout(() => {
      setShowReactions(true);
      onLongPress?.();
    }, 500);
    setPressTimer(timer);
  };
  
  const handlePressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };
  
  return (
    <div 
      className={`relative flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className={`max-w-[70%] ${isMine ? 'msg-mine' : 'msg-other'} rounded-2xl px-4 py-3 relative`}>
        <p className="text-white">{message.text}</p>
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-3 left-2 flex space-x-1">
            {message.reactions.map((reaction, i) => (
              <span 
                key={i}
                className="text-lg glass rounded-full px-2 py-1 cursor-pointer hover:scale-110 transition-transform"
              >
                {reaction}
              </span>
            ))}
          </div>
        )}
        
        {/* Reaction Picker */}
        {showReactions && (
          <div className="absolute -top-12 left-0 glass rounded-full px-3 py-2 flex space-x-2 z-50">
            {['❤️', '😂', '🔥', '👍', '😍', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(emoji);
                  setShowReactions(false);
                }}
                className="text-xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ========== 7. THEME SWITCHER COMPONENT ==========
export const ThemeSwitcher = ({ currentTheme, onThemeChange, themes }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-lg px-4 py-2 flex items-center space-x-2 hover:bg-white/10 transition"
      >
        <span>🎨</span>
        <span className="text-sm">{currentTheme}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 glass rounded-lg p-2 w-48 shadow-2xl z-50">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => {
                onThemeChange(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-white/10 transition ${
                currentTheme === key ? 'bg-white/10' : ''
              }`}
            >
              <div className="font-semibold text-white">{theme.name}</div>
              <div className="flex space-x-1 mt-1">
                <div className="w-4 h-4 rounded" style={{ background: theme.colors.accent }}></div>
                <div className="w-4 h-4 rounded" style={{ background: theme.colors.accentSecondary }}></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ========== 8. SCROLL TO BOTTOM BUTTON ==========
export const ScrollToBottomButton = ({ onClick, hasNewMessages }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-8 glass rounded-full p-4 shadow-2xl hover:scale-110 transition-transform z-40 ${
        hasNewMessages ? 'pulse-border' : ''
      }`}
    >
      <span className="text-2xl">⬇️</span>
      {hasNewMessages && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          !
        </span>
      )}
    </button>
  );
};

// ========== 9. USER AVATAR COMPONENT ==========
export const UserAvatar = ({ 
  username, 
  isOnline = true, 
  isOnFire = false, 
  size = 'md',
  onClick 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl'
  };
  
  return (
    <div 
      className={`relative ${sizes[size]} ${isOnFire ? 'fire-effect' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className={`w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold ${isOnline ? 'pulse-border' : ''}`}>
        {username[0].toUpperCase()}
      </div>
      
      {isOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

// ========== 10. COMMAND HINT COMPONENT ==========
export const CommandHint = ({ command, description }) => {
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm flex items-center space-x-2 hover:bg-white/10 transition cursor-pointer">
      <span className="text-purple-400 font-mono">{command}</span>
      <span className="text-gray-400">→</span>
      <span className="text-gray-300">{description}</span>
    </div>
  );
};

// ========== ANIMATIONS CSS (adicione ao seu CSS) ==========
export const animationStyles = `
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes badgeSlideIn {
  from { transform: translateX(400px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes badgeSlideOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(400px); opacity: 0; }
}

.typing-dot {
  animation: typing-bounce 1.4s infinite ease-in-out;
}

@keyframes typing-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

.fire-effect {
  animation: fire-flicker 0.3s infinite;
  filter: drop-shadow(0 0 10px #FFB627);
}

@keyframes fire-flicker {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  25% { transform: scale(1.1) rotate(-5deg); opacity: 0.9; }
  50% { transform: scale(0.9) rotate(5deg); opacity: 1; }
  75% { transform: scale(1.05) rotate(-3deg); opacity: 0.95; }
}

.pulse-border {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px var(--neon-purple), 0 0 10px var(--neon-purple); }
  50% { box-shadow: 0 0 20px var(--neon-purple), 0 0 40px var(--neon-purple); }
}
`;
