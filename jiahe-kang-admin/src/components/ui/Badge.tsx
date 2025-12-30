import { cn } from '../../lib/cn';

type Variant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const variantClass: Record<Variant, string> = {
  info: 'bg-jhk-primarySoft text-jhk-primary',
  success: 'bg-jhk-successSoft text-jhk-success',
  warning: 'bg-jhk-warnSoft text-jhk-warn',
  danger: 'bg-jhk-dangerSoft text-jhk-danger',
  neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}

