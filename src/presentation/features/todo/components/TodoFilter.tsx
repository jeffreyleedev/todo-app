import { useTodoStore } from '@/application';
import { useShallow } from 'zustand/shallow';
import { cn } from '@/presentation/shared/utils/cn';
import type { Filter } from '@/domain';

export function TodoFilter() {
  const { filter, setFilter } = useTodoStore(
    useShallow((state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    }))
  );

  const filters: { label: string; value: Filter }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'ACTIVE', value: 'active' },
    { label: 'COMPLETED', value: 'completed' },
  ];

  return (
    <div className="flex gap-8 order-1 sm:order-2">
      {filters.map((filterOption) => (
        <button
          key={filterOption.value}
          onClick={() => setFilter(filterOption.value)}
          className={cn(
            'font-kicker px-12 py-4 rounded-20 transition-colors duration-150',
            filter === filterOption.value
              ? 'bg-mint text-black'
              : 'bg-slate text-text-secondary hover:text-text-primary'
          )}
        >
          {filterOption.label}
        </button>
      ))}
    </div>
  );
}
