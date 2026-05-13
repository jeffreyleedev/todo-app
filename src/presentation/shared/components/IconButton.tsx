import { cn } from '@/presentation/shared/utils/cn';
import { FOCUS_STATES } from '@/presentation/shared/utils/focusTokens';
import { Icon } from './Icon';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  variant?: 'primary' | 'ghost' | 'error';
  fill?: boolean;
  shape?: 'circle' | 'square';
}

const ICON_BUTTON_VARIANTS = {
  primary: `bg-mint text-black hover:opacity-80 active:opacity-60 ${FOCUS_STATES}`,
  ghost: `text-text-secondary hover:text-text-primary active:text-text-primary ${FOCUS_STATES}`,
  error: `text-text-secondary hover:text-ultraviolet active:text-ultraviolet ${FOCUS_STATES}`,
};

const ICON_BUTTON_SHAPES = {
  circle: 'rounded-half',
  square: 'rounded-4',
};

export function IconButton({
  icon,
  variant = 'ghost',
  fill = false,
  shape = 'circle',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        'w-[32px] h-[32px] shrink-0 flex items-center justify-center transition-all duration-180',
        ICON_BUTTON_VARIANTS[variant],
        ICON_BUTTON_SHAPES[shape],
        className
      )}
      {...props}
    >
      <Icon name={icon} fill={fill} className="text-[20px]" />
    </button>
  );
}
