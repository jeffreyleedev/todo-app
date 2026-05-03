import { Icon } from '@/presentation/shared/components/Icon';
import { ThemeToggle } from '@/presentation/shared/components/ThemeToggle';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-variant/10 flex justify-center items-center">
      <div className="w-full max-w-7xl px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-base">
          <Icon name="task_alt" fill className="text-primary text-[28px]" />
          <span className="font-headline-sm text-on-surface font-semibold">
            FocusTask
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
