import { Header } from './Header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main className="pt-[88px] sm:pt-[112px] pb-16 px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
        {children}
      </main>
    </div>
  );
}
