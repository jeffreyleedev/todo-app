import { IconButton } from './IconButton';
import { useThemeContext } from '@/presentation/shared/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';

  return (
    <IconButton
      icon={isDark ? 'light_mode' : 'dark_mode'}
      variant="ghost"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  );
}
