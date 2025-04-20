import { DefaultTheme } from '@react-navigation/native';

export const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3', // Blue
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return children;
}
