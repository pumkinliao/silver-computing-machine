import { cn } from '../lib/cn';

export function SegmentedTabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-2xl border border-jhk-line bg-white p-1 shadow-sm">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={cn(
            'h-9 rounded-xl px-3 text-sm font-medium transition',
            it.value === value
              ? 'bg-jhk-primarySoft text-jhk-primary'
              : 'text-slate-700 hover:bg-slate-100',
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

