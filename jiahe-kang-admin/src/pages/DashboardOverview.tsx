import { Activity, Bell, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { alerts, elders, getElder } from '../mock/data';
import { Link } from 'react-router-dom';

function MetricCard({
  title,
  value,
  icon,
  hint,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>
          <div className="mt-2 text-xs text-slate-500">{hint}</div>
        </div>
        <div className="rounded-2xl bg-jhk-primarySoft p-3 text-jhk-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const totalElders = elders.length;
  const activeCaregivers = 5; // prototype placeholder
  const recentAlerts = alerts.length;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">家賀康（Jia He Kang）管理後台原型</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          總覽儀表板
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="長輩總數"
          value={String(totalElders)}
          hint="目前系統內建檔案數"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="活躍照護者"
          value={String(activeCaregivers)}
          hint="近 24 小時有紀錄上傳"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          title="近期警示"
          value={String(recentAlerts)}
          hint="需要留意的異常模式"
          icon={<Bell className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>特別關注（Special Attention）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a) => {
            const elder = getElder(a.elderId);
            const severityVariant =
              a.severity === 'danger'
                ? 'danger'
                : a.severity === 'warning'
                  ? 'warning'
                  : 'info';
            return (
              <Link
                key={a.id}
                to={`/patients/${a.elderId}`}
                className="flex items-start justify-between gap-3 rounded-2xl border border-jhk-line bg-white p-4 hover:bg-slate-50"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {elder ? `${elder.name}（${elder.age} 歲）` : a.elderId}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{a.detail}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={severityVariant}>{a.title}</Badge>
                    <Badge variant="neutral">需要追蹤</Badge>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">更新：剛剛</div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

