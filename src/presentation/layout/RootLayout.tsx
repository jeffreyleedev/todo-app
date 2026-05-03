import { Header } from './Header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <main className="pt-[80px] sm:pt-[100px] pb-12 sm:pb-xl px-4 sm:px-6 md:px-margin max-w-3xl mx-auto flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
        {children}
      </main>
    </div>
  );
}
