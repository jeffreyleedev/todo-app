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
    primary: 'bg-mint text-black hover:opacity-80 active:opacity-60',
    ghost:
      'text-text-secondary hover:text-text-primary active:text-text-primary',
    error: 'text-text-secondary hover:text-ultraviolet active:text-ultraviolet',
  };

  const shapes = {
    circle: 'rounded-half',
    square: 'rounded-4',
  };

  return (
    <button
      className={cn(
        'w-[32px] h-[32px] flex items-center justify-center transition-all duration-180',
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
