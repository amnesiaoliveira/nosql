/**
 * 🎨 TEMAS DINÂMICOS
 * Arquivo com temas customizáveis para o chat
 */

export const themes = {
  dark: {
    name: 'AMOLED Dark',
    colors: {
      bg: '#000000',
      bgCard: '#0D0D0D',
      bgHover: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#888888',
      accent: '#C77DFF',
      accentSecondary: '#7B68EE',
      myMessage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      otherMessage: '#1A1A1A',
    },
    particles: {
      color: '#C77DFF',
      count: 50,
    }
  },
  
  pastel: {
    name: 'Pastel Dreams',
    colors: {
      bg: '#FFF5F7',
      bgCard: '#FFFFFF',
      bgHover: '#F0E6E9',
      text: '#2D2D2D',
      textSecondary: '#888888',
      accent: '#FFB3D9',
      accentSecondary: '#C9A0DC',
      myMessage: 'linear-gradient(135deg, #FFB3D9 0%, #C9A0DC 100%)',
      otherMessage: '#F0E6E9',
    },
    particles: {
      color: '#FFB3D9',
      count: 30,
    }
  },
  
  cyberpunk: {
    name: 'Cyberpunk 2077',
    colors: {
      bg: '#0A0E27',
      bgCard: '#141B3D',
      bgHover: '#1E2749',
      text: '#00FFF0',
      textSecondary: '#FF00FF',
      accent: '#FF00FF',
      accentSecondary: '#00FFF0',
      myMessage: 'linear-gradient(135deg, #FF00FF 0%, #00FFF0 100%)',
      otherMessage: '#1E2749',
    },
    particles: {
      color: '#FF00FF',
      count: 80,
    }
  },
  
  retroWave: {
    name: 'Retro Wave',
    colors: {
      bg: 'linear-gradient(180deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
      bgCard: 'rgba(255, 255, 255, 0.05)',
      bgHover: 'rgba(255, 255, 255, 0.1)',
      text: '#FF6EC7',
      textSecondary: '#F7DC6F',
      accent: '#FF6EC7',
      accentSecondary: '#00D9FF',
      myMessage: 'linear-gradient(135deg, #FF6EC7 0%, #00D9FF 100%)',
      otherMessage: 'rgba(255, 255, 255, 0.1)',
    },
    particles: {
      color: '#FF6EC7',
      count: 60,
    }
  },
  
  nature: {
    name: 'Nature Vibe',
    colors: {
      bg: 'linear-gradient(180deg, #134E5E 0%, #71B280 100%)',
      bgCard: 'rgba(255, 255, 255, 0.1)',
      bgHover: 'rgba(255, 255, 255, 0.15)',
      text: '#FFFFFF',
      textSecondary: '#E0F7FA',
      accent: '#66BB6A',
      accentSecondary: '#26A69A',
      myMessage: 'linear-gradient(135deg, #66BB6A 0%, #26A69A 100%)',
      otherMessage: 'rgba(0, 0, 0, 0.2)',
    },
    particles: {
      color: '#66BB6A',
      count: 40,
    }
  },
  
  sunset: {
    name: 'Sunset Glow',
    colors: {
      bg: 'linear-gradient(180deg, #FF512F 0%, #F09819 50%, #DD2476 100%)',
      bgCard: 'rgba(255, 255, 255, 0.1)',
      bgHover: 'rgba(255, 255, 255, 0.15)',
      text: '#FFFFFF',
      textSecondary: '#FFE5B4',
      accent: '#FFD700',
      accentSecondary: '#FF6347',
      myMessage: 'linear-gradient(135deg, #FFD700 0%, #FF6347 100%)',
      otherMessage: 'rgba(0, 0, 0, 0.2)',
    },
    particles: {
      color: '#FFD700',
      count: 45,
    }
  },
  
  matrix: {
    name: 'The Matrix',
    colors: {
      bg: '#000000',
      bgCard: '#001100',
      bgHover: '#002200',
      text: '#00FF00',
      textSecondary: '#00AA00',
      accent: '#00FF00',
      accentSecondary: '#00AA00',
      myMessage: 'linear-gradient(135deg, #00FF00 0%, #00AA00 100%)',
      otherMessage: '#002200',
    },
    particles: {
      color: '#00FF00',
      count: 100,
    }
  },
  
  ocean: {
    name: 'Deep Ocean',
    colors: {
      bg: 'linear-gradient(180deg, #000428 0%, #004e92 100%)',
      bgCard: 'rgba(255, 255, 255, 0.05)',
      bgHover: 'rgba(255, 255, 255, 0.1)',
      text: '#E0F7FA',
      textSecondary: '#B2EBF2',
      accent: '#00BCD4',
      accentSecondary: '#0097A7',
      myMessage: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
      otherMessage: 'rgba(0, 188, 212, 0.1)',
    },
    particles: {
      color: '#00BCD4',
      count: 35,
    }
  }
};

/**
 * Função para aplicar tema
 */
export const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (!theme) return;
  
  const root = document.documentElement;
  
  // Aplica cores CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Aplica background
  document.body.style.background = theme.colors.bg;
  
  return theme;
};

/**
 * Detector automático de tema baseado em hora
 */
export const getAutoTheme = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) return 'sunset';  // Amanhecer
  if (hour >= 8 && hour < 18) return 'pastel';  // Dia
  if (hour >= 18 && hour < 20) return 'retroWave';  // Pôr do sol
  if (hour >= 20 && hour < 22) return 'cyberpunk';  // Noite
  return 'dark';  // Madrugada
};

/**
 * Sistema de temas baseado em palavras-chave
 */
export const getThemeByKeyword = (text) => {
  const keywords = {
    'boa noite': 'dark',
    'bom dia': 'pastel',
    'gm': 'sunset',
    'praia': 'ocean',
    'natureza': 'nature',
    'matrix': 'matrix',
    'cyberpunk': 'cyberpunk',
    'retro': 'retroWave',
  };
  
  const lowerText = text.toLowerCase();
  for (const [keyword, theme] of Object.entries(keywords)) {
    if (lowerText.includes(keyword)) {
      return theme;
    }
  }
  
  return null;
};
