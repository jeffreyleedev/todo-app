import { useTheme } from '@/presentation/shared/hooks/useTheme';
import { IconButton } from '@/presentation/shared/components/IconButton';

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-canvas border-b border-mint flex justify-center items-center py-8">
      <div className="flex-1" />
      <div className="font-display-md text-mint tracking-wider">TASKS</div>
      <div className="flex-1 flex justify-end pr-12">
        <IconButton
          icon={theme === 'dark' ? 'light_mode' : 'dark_mode'}
          variant="ghost"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        />
      </div>
    </header>
  );
}
