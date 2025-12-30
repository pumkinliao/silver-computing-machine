import { cn } from '../../lib/cn';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-jhk-primary text-white hover:opacity-95 active:opacity-90 shadow-sm',
  ghost: 'hover:bg-slate-100 active:bg-slate-200',
  outline:
    'border border-jhk-line bg-white hover:bg-slate-50 active:bg-slate-100',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-10 px-4 text-sm rounded-xl',
};

export function Button({
  variant = 'outline',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}

