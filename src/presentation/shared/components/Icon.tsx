import { cn } from '@/presentation/shared/utils/cn';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  fill?: boolean;
}

const ICON_VARIATION_STYLES = {
  filled: {
    fontVariationSettings: "'FILL' 1, 'wght' 300, 'GRAD' 0, 'opsz' 24",
  },
  outlined: {
    fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
  },
};

export function Icon({ name, fill = false, className, ...props }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined', className)}
      style={ICON_VARIATION_STYLES[fill ? 'filled' : 'outlined']}
      {...props}
    >
      {name}
    </span>
  );
}
