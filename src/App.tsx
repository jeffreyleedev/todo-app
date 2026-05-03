import { ThemeProvider } from '@/presentation/shared/context/ThemeContext';
import { RootLayout } from '@/presentation/layout/RootLayout';
import { HomePage } from '@/presentation/pages/HomePage';

export default function App() {
  return (
    <ThemeProvider>
      <RootLayout>
        <HomePage />
      </RootLayout>
    </ThemeProvider>
  );
}
