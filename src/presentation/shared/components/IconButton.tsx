import { cn } from '@/presentation/shared/utils/cn';
import { Icon } from './Icon';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'primary' | 'ghost' | 'error';
  fill?: boolean;
  shape?: 'circle' | 'square';
}

export function IconButton({
  icon,
  variant = 'ghost',
  fill = false,
  shape = 'circle',
  className,
  ...props
}: IconButtonProps) {
  const variants = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-container active:scale-90 shadow-sm',
    ghost:
      'text-on-surface-variant hover:bg-surface-variant/50 active:scale-95',
    error:
      'text-outline-variant hover:text-error hover:bg-error-container active:scale-95',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded',
  };

  return (
    <button
      className={cn(
        'w-[32px] h-[32px] flex items-center justify-center transition-all duration-200',
        variants[variant],
        shapes[shape],
        className
      )}
      {...props}
    >
      <Icon name={icon} fill={fill} className="text-[20px]" />
    </button>
  );
}
