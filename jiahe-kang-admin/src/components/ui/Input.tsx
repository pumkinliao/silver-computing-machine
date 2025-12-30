import { cn } from '../../lib/cn';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-jhk-line bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm',
        'focus:ring-4 focus:ring-jhk-primarySoft focus:border-jhk-primary',
        className,
      )}
      {...props}
    />
  );
}

