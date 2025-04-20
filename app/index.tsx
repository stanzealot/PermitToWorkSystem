import { Redirect } from 'expo-router';

export default function Index() {
  // If using authentication:
  // const { user } = useAuth();
  // return user ? <Redirect href="/(dashboard)" /> : <Redirect href="/(auth)/login" />;

  // For now, just redirect to login
  return <Redirect href="/auth/login" />;
}
