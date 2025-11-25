// Color scheme for GoMate
export const colors = {
  light: {
    bg: '#f8f9fa',
    surface: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#e0e0e0',
    primary: '#007AFF',
    primaryLight: '#E3F2FD',
    success: '#27ae60',
    error: '#d9534f',
    warning: '#f39c12',
  },
  dark: {
    bg: '#0f0f0f',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    border: '#333333',
    primary: '#007AFF',
    primaryLight: '#1e3a5f',
    success: '#27ae60',
    error: '#d9534f',
    warning: '#f39c12',
  }
};

export const getThemeColors = (isDark) => isDark ? colors.dark : colors.light;
