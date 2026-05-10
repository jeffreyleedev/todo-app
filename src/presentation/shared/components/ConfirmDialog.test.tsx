import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('should render title and message', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        title="Confirm action?"
        message="Are you sure?"
        confirmLabel="Do it"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText('Confirm action?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should have role="dialog" and aria-modal="true"', () => {
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Do it"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should label dialog via aria-labelledby pointing to the title heading', () => {
    render(
      <ConfirmDialog
        title="Delete item?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title');
    expect(
      screen.getByRole('heading', { name: 'Delete item?' })
    ).toHaveAttribute('id', 'confirm-dialog-title');
  });

  it('should render confirmLabel text in the confirm button', () => {
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Delete forever"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    const confirmButton = screen.getByTestId('confirm-dialog-confirm');
    expect(confirmButton).toHaveTextContent('Delete forever');
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Do it"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Do it"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByTestId('confirm-dialog-cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('should render close icon button', () => {
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Do it"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByTestId('confirm-dialog-close')).toBeInTheDocument();
  });

  it('should call onCancel when close icon is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        title="Test"
        message="Test?"
        confirmLabel="Do it"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByTestId('confirm-dialog-close'));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
