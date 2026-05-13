import type { Priority } from '@/domain';
import { cyclePriority } from '@/domain';
import { Icon } from '@/presentation/shared/components/Icon';
import { cn } from '@/presentation/shared/utils/cn';

const PRIORITY_BASE = 'font-kicker px-10 py-4 rounded-20';

const priorityColors: Record<Priority, string> = {
  high: 'bg-ultraviolet text-white',
  medium: 'bg-accent-yellow text-black',
  low: 'bg-mint text-black',
};

interface PriorityButtonProps {
  priority: Priority | undefined;
  onSetPriority: (priority?: Priority) => void;
}

export function PriorityButton({
  priority,
  onSetPriority,
}: PriorityButtonProps) {
  if (priority) {
    return (
      <button
        type="button"
        data-testid="priority-pill"
        onClick={() => onSetPriority(cyclePriority(priority))}
        className={cn(
          PRIORITY_BASE,
          priorityColors[priority],
          'shrink-0 transition-opacity hover:opacity-80'
        )}
      >
        {priority}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Set priority"
      onClick={() => onSetPriority('high')}
      data-testid="priority-pill-add"
      className="shrink-0 flex items-center justify-center w-[24px] h-[24px] rounded-half bg-slate text-text-secondary hover:text-mint transition-colors md:w-auto md:h-auto md:rounded-20 md:font-kicker md:px-10 md:py-4 md:opacity-0 md:group-hover:opacity-100"
    >
      <Icon name="add" className="text-[16px] md:hidden" />
      <span className="hidden md:inline">+PRIORITY</span>
    </button>
  );
}
