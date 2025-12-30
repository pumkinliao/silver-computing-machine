import { Bell, Menu, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { alerts, mockAdmin } from '../mock/data';

export function HeaderBar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const alertCount = alerts.length;
  return (
    <header className="sticky top-0 z-20 border-b border-jhk-line bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-xl p-0 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="開啟側邊欄"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden w-[420px] max-w-[42vw] lg:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="搜尋長輩、照護者、事件…" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-jhk-line bg-white hover:bg-slate-50"
            aria-label="通知"
          >
            <Bell className="h-5 w-5 text-slate-700" />
            {alertCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-jhk-danger px-1 text-[10px] font-semibold text-white">
                {alertCount}
              </span>
            ) : null}
          </button>

          <div className="flex items-center gap-3 rounded-2xl border border-jhk-line bg-white px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-jhk-successSoft text-jhk-success">
              <span className="text-xs font-semibold">管</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-slate-900">{mockAdmin.name}</div>
              <div className="text-xs text-slate-500">{mockAdmin.org}</div>
            </div>
            <Badge className="hidden sm:inline-flex" variant="info">
              在線
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}

