import { Button } from './Button';
import { IconButton } from './IconButton';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      data-testid="confirm-dialog-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-sm"
    >
      <div
        data-testid="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-surface rounded-xl shadow-[var(--shadow-overlay)] border border-surface-variant/50 p-md w-full max-w-[24rem]"
      >
        <div className="flex items-start justify-between mb-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface pr-md">
            {title}
          </h2>
          <IconButton
            icon="close"
            variant="ghost"
            shape="circle"
            onClick={onCancel}
            aria-label="Close dialog"
            data-testid="confirm-dialog-close"
            className="-mt-xs -mr-xs"
          />
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          {message}
        </p>
        <div className="flex justify-end gap-sm">
          <Button
            variant="ghost"
            onClick={onCancel}
            data-testid="confirm-dialog-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="bg-error text-on-error hover:bg-error-container"
            onClick={onConfirm}
            data-testid="confirm-dialog-confirm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
