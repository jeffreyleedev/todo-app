import { cn } from '@/presentation/shared/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-container hover:shadow-md active:scale-95',
    secondary: 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95',
    ghost:
      'text-on-surface-variant hover:bg-surface-variant/50 active:scale-95',
    error:
      'text-on-surface-variant hover:text-error hover:bg-error-container/10 active:scale-95',
  };

  const sizes = {
    sm: 'px-md py-xs text-label-md rounded-full',
    md: 'px-md py-sm rounded-lg',
    lg: 'px-lg py-md rounded-xl',
  };

  return (
    <button
      className={cn(
        'transition-all duration-200 flex items-center justify-center font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
