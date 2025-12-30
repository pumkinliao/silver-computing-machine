import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { cn } from '../lib/cn';
import { Button } from './ui/Button';

function formatRange(range?: DateRange) {
  if (!range?.from && !range?.to) return '選擇日期區間';
  if (range.from && !range.to) return `${format(range.from, 'yyyy/MM/dd')} ～ …`;
  if (!range.from && range.to) return `… ～ ${format(range.to, 'yyyy/MM/dd')}`;
  return `${format(range.from!, 'yyyy/MM/dd')} ～ ${format(range.to!, 'yyyy/MM/dd')}`;
}

export function DateRangePicker({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (v: DateRange | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  const label = useMemo(() => formatRange(value), [value]);

  return (
    <div className="relative" ref={ref}>
      <Button variant="outline" className="gap-2" onClick={() => setOpen((v) => !v)}>
        <CalendarDays className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">日期</span>
      </Button>

      {open ? (
        <div className="absolute right-0 top-12 z-30 w-[360px] max-w-[90vw] rounded-2xl border border-jhk-line bg-white p-3 shadow-card">
          <div className="px-2 pb-2 text-sm font-medium text-slate-900">日期區間</div>
          <DayPicker
            mode="range"
            selected={value}
            onSelect={onChange}
            weekStartsOn={1}
            showOutsideDays
          />
          <div className="flex items-center justify-between gap-2 px-2 pt-2">
            <button
              className="text-sm text-slate-600 hover:text-slate-900"
              onClick={() => onChange(undefined)}
            >
              清除
            </button>
            <button
              className={cn(
                'rounded-xl bg-jhk-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95',
              )}
              onClick={() => setOpen(false)}
            >
              套用
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

