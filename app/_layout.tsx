import { ThemeProvider } from '@/constants/theme';
import { Stack } from 'expo-router';
import { PermitsProvider } from './context/PermitsContext';

export default function RootLayout() {
  return (
    <PermitsProvider>
      {/* Your existing layout */}
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="admin" />
          <Stack.Screen name="permits" />
          <Stack.Screen name="profile" />
        </Stack>
      </ThemeProvider>
    </PermitsProvider>
  );
}
