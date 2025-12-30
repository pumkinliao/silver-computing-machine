import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { AlertTriangle, Bell, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/cn';
import { alerts, getElder } from '../mock/data';
import { Badge } from './ui/Badge';

function severityBadge(sev: 'info' | 'warning' | 'danger') {
  if (sev === 'danger') return <Badge variant="danger">高</Badge>;
  if (sev === 'warning') return <Badge variant="warning">中</Badge>;
  return <Badge variant="info">低</Badge>;
}

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = alerts.length;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = useMemo(
    () => [...alerts].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    [],
  );

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-jhk-line bg-white hover:bg-slate-50"
        aria-label="通知與警示"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5 text-slate-700" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-jhk-danger px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-40 w-[420px] max-w-[92vw] overflow-hidden rounded-2xl border border-jhk-line bg-white shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-jhk-line px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-jhk-warn" />
              <div className="text-sm font-semibold text-slate-900">特別關注警示</div>
            </div>
            <div className="text-xs text-slate-500">{count} 則</div>
          </div>

          <div className="max-h-[380px] overflow-auto p-2">
            {items.length === 0 ? (
              <div className="p-4 text-sm text-slate-600">目前沒有需要關注的警示。</div>
            ) : (
              <div className="space-y-2">
                {items.map((a) => {
                  const elder = getElder(a.elderId);
                  return (
                    <Link
                      key={a.id}
                      to={`/patients/${a.elderId}`}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-2xl border border-jhk-line bg-white p-3 hover:bg-slate-50',
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-sm font-medium text-slate-900">
                              {elder ? `${elder.name}（${elder.age}）` : a.elderId}
                            </div>
                            {severityBadge(a.severity)}
                            <Badge variant="neutral">{a.title}</Badge>
                          </div>
                          <div className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {a.detail}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            {formatDistanceToNowStrict(parseISO(a.createdAt), {
                              addSuffix: true,
                              locale: zhTW,
                            })}
                          </div>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

