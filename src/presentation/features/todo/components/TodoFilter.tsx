import { useTodoStore } from '@/application';
import { cn } from '@/presentation/shared/utils/cn';
import type { Filter } from '@/domain';

export function TodoFilter() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  const filters: { label: string; value: Filter }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'ACTIVE', value: 'active' },
    { label: 'COMPLETED', value: 'completed' },
  ];

  return (
    <div className="flex gap-8 order-1 sm:order-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={cn(
            'font-kicker px-12 py-4 rounded-20 transition-colors duration-150',
            filter === f.value
              ? 'bg-mint text-black'
              : 'bg-slate text-text-secondary hover:text-text-primary'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
