import {
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  isWithinInterval,
} from 'date-fns';

export type Granularity = 'day' | 'week' | 'month';

export function formatTickLabel(dateISO: string, granularity: Granularity) {
  const d = parseISO(dateISO);
  if (granularity === 'day') return format(d, 'MM/dd');
  if (granularity === 'week') return `${format(d, 'MM/dd')}（週）`;
  return format(d, 'yyyy/MM');
}

export function inDateRange(dateISO: string, range?: { from?: Date; to?: Date }) {
  if (!range?.from && !range?.to) return true;
  const d = parseISO(dateISO);
  const from = range.from ?? d;
  const to = range.to ?? d;
  return isWithinInterval(d, { start: from, end: to });
}

export function groupSeries<T extends { date: string }>(
  rows: T[],
  granularity: Granularity,
  reducer: (items: T[]) => T,
) {
  if (granularity === 'day') return rows;
  const buckets = new Map<string, T[]>();
  for (const r of rows) {
    const d = parseISO(r.date);
    const key =
      granularity === 'week'
        ? format(startOfWeek(d, { weekStartsOn: 1 }), 'yyyy-MM-dd')
        : format(startOfMonth(d), 'yyyy-MM-dd');
    const arr = buckets.get(key) ?? [];
    arr.push(r);
    buckets.set(key, arr);
  }
  const out: T[] = [];
  for (const [key, items] of buckets.entries()) {
    out.push({ ...reducer(items), date: key });
  }
  out.sort((a, b) => (a.date < b.date ? -1 : 1));
  return out;
}

export function mean(nums: number[]) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

