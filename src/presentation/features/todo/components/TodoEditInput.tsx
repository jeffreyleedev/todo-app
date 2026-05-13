import { TODO_MAX_LENGTH } from '@/domain';
import { CharCounter } from '@/presentation/shared/components/CharCounter';
import { cn } from '@/presentation/shared/utils/cn';
import { FOCUS_RING } from '@/presentation/shared/utils/focusTokens';

interface TodoEditInputProps {
  editText: string;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: () => void;
  errorMessage?: string | null;
  max?: number;
}

export function TodoEditInput({
  editText,
  editInputRef,
  onChange,
  onKeyDown,
  onBlur,
  errorMessage,
  max = TODO_MAX_LENGTH,
}: TodoEditInputProps) {
  return (
    <div className="flex-1 relative">
      <input
        ref={editInputRef}
        type="text"
        value={editText}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        maxLength={max}
        data-testid="todo-edit-input"
        className={cn(
          'w-full bg-canvas py-5 pl-4 pr-[80px] rounded-2 border border-mint font-body text-text-primary outline-none',
          FOCUS_RING
        )}
      />
      <CharCounter
        length={editText.length}
        max={max}
        data-testid="todo-edit-char-counter"
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-canvas pl-2"
      />
      {errorMessage && (
        <p
          className="absolute left-0 -bottom-5 font-caption text-ultraviolet"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
