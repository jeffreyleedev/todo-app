import { cn } from '@/presentation/shared/utils/cn';
import { getCharacterStatus } from '@/presentation/shared/utils/getCharacterStatus';

interface CharCounterProps {
  length: number;
  max: number;
  className?: string;
  'data-testid'?: string;
}

export function CharCounter({
  length,
  max,
  className,
  'data-testid': testId,
}: CharCounterProps) {
  const { isAtLimit, isNearLimit } = getCharacterStatus(length, max);

  return (
    <div
      data-testid={testId}
      className={cn(
        'font-caption',
        isAtLimit
          ? 'text-ultraviolet'
          : isNearLimit
            ? 'text-accent-yellow'
            : 'text-text-secondary',
        className
      )}
    >
      {length} / {max}
    </div>
  );
}
