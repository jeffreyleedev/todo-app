import { useTodoStore } from '@/application';
import { cn } from '@/presentation/shared/utils/cn';
import type { Filter } from '@/domain';

export function TodoFilter() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex gap-sm order-1 sm:order-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={cn(
            'font-label-md text-label-md transition-colors',
            filter === f.value
              ? 'text-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
