import { cn } from '@/presentation/shared/utils/cn';
import { FOCUS_STATES } from '@/presentation/shared/utils/focusTokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'error' | 'tertiary';
  /** Has no effect when variant is 'tertiary' — tertiary carries fixed sizing in its variant class. */
  size?: 'sm' | 'md' | 'lg';
}

const BUTTON_VARIANTS = {
  primary: `bg-mint text-black font-mono-btn hover:bg-button-hover-overlay hover:ring-1 hover:ring-ring-hover active:bg-dim-gray active:opacity-50 active:ring-dim-gray ${FOCUS_STATES}`,
  secondary: `bg-slate text-text-muted font-mono-btn hover:bg-button-hover-overlay hover:text-black hover:ring-1 hover:ring-ring-hover ${FOCUS_STATES}`,
  ghost: `text-text-primary hover:text-deep-link-blue ${FOCUS_STATES}`,
  error: `bg-ultraviolet text-white font-mono-btn hover:bg-button-hover-overlay hover:text-black hover:ring-1 hover:ring-ring-hover active:bg-dim-gray active:opacity-50 active:ring-dim-gray ${FOCUS_STATES}`,
  tertiary: `bg-transparent text-mint border border-mint font-mono-btn hover:bg-mint hover:text-black rounded-40 px-20 py-10 transition-colors duration-150 ${FOCUS_STATES}`,
};

const BUTTON_SIZES = {
  sm: 'px-12 py-5 text-[11px] rounded-20',
  md: 'px-24 py-10 rounded-24',
  lg: 'px-32 py-14 rounded-30',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'transition-all duration-180 flex items-center justify-center',
        BUTTON_VARIANTS[variant],
        variant !== 'tertiary' && BUTTON_SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
