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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.33] px-12"
    >
      <div
        data-testid="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-canvas rounded-20 border border-text-primary p-24 w-full max-w-[24rem]"
      >
        <div className="flex items-start justify-between mb-12">
          <h2 className="font-headline-sm text-text-primary pr-24">{title}</h2>
          <IconButton
            icon="close"
            variant="ghost"
            shape="circle"
            onClick={onCancel}
            aria-label="Close dialog"
            data-testid="confirm-dialog-close"
            className="-mt-4 -mr-4"
          />
        </div>
        <p className="font-body text-text-secondary mb-24">{message}</p>
        <div className="flex justify-end gap-12">
          <Button
            variant="ghost"
            onClick={onCancel}
            data-testid="confirm-dialog-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="error"
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
