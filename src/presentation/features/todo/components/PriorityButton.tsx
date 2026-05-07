import type { Priority } from '@/domain';
import { cyclePriority } from '@/domain';
import { Icon } from '@/presentation/shared/components/Icon';
import { cn } from '@/presentation/shared/utils/cn';

const priorityColors: Record<Priority, string> = {
  high: 'bg-ultraviolet text-white font-kicker px-10 py-4 rounded-20',
  medium: 'bg-accent-yellow text-black font-kicker px-10 py-4 rounded-20',
  low: 'bg-mint text-black font-kicker px-10 py-4 rounded-20',
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
          priorityColors[priority],
          'transition-opacity hover:opacity-80'
        )}
      >
        {priority}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onSetPriority('high')}
        data-testid="priority-pill-add"
        className="font-kicker px-10 py-4 rounded-20 bg-slate text-text-secondary hover:text-mint hidden md:inline-flex md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        +PRIORITY
      </button>
      <button
        type="button"
        onClick={() => onSetPriority('high')}
        className="md:hidden w-[24px] h-[24px] flex items-center justify-center rounded-half text-text-secondary hover:text-mint transition-colors"
        data-testid="priority-pill-add-mobile"
      >
        <Icon name="add" className="text-[16px]" />
      </button>
    </>
  );
}
