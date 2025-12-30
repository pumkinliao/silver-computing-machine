import {
  BarChart3,
  LayoutDashboard,
  NotebookPen,
  Settings,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/cn';

const nav = [
  { to: '/', label: '總覽儀表板', icon: LayoutDashboard },
  { to: '/patients', label: '長輩管理', icon: Users },
  { to: '/care-logs', label: '照護紀錄', icon: NotebookPen },
  { to: '/analytics', label: '數據分析', icon: BarChart3 },
  { to: '/settings', label: '設定', icon: Settings },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-jhk-line bg-white">
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-jhk-primarySoft text-jhk-primary shadow-sm">
            <span className="text-sm font-semibold">家</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">家賀康</div>
            <div className="text-xs text-slate-500">管理後台原型</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 pb-4">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-jhk-primarySoft text-jhk-primary'
                    : 'text-slate-700 hover:bg-slate-100',
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-jhk-line px-5 py-4">
        <div className="text-xs text-slate-500">
          版本：原型 · 資料：模擬資料
        </div>
      </div>
    </aside>
  );
}

