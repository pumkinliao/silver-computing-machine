import { format, parseISO, subDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import {
  ChevronLeft,
  MessageCircle,
  Stethoscope,
  Tablet,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import type { DateRange } from 'react-day-picker';
import { CareLogTimeline } from '../components/CareLogTimeline';
import { ChatThread } from '../components/ChatThread';
import { DateRangePicker } from '../components/DateRangePicker';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import {
  careLogs,
  getElder,
  tabletMessages,
  unityDailyActivityForElder,
} from '../mock/data';
import { formatTickLabel, groupSeries, inDateRange, mean, type Granularity } from '../lib/time';

export default function PatientDetail() {
  const params = useParams();
  const elderId = params.elderId ?? 'grandpa-wang';
  const elder = getElder(elderId);

  const today = new Date();
  const [granularity, setGranularity] = useState<Granularity>('day');
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(today, 13),
    to: today,
  });
  const [interventionDate, setInterventionDate] = useState<string>(
    format(subDays(today, 7), 'yyyy-MM-dd'),
  );

  const rawUnity = useMemo(
    () => unityDailyActivityForElder(elderId),
    [elderId],
  );

  const filteredUnity = useMemo(
    () => rawUnity.filter((r) => inDateRange(r.date, range)),
    [rawUnity, range],
  );

  const chartData = useMemo(() => {
    const daily = filteredUnity.map((d) => ({
      date: d.date,
      label: formatTickLabel(d.date, granularity),
      memoryMatch: d.gameScores.memoryMatch,
      clickCount: d.interaction.clickCount,
      usageMinutes: d.interaction.usageMinutes,
    }));

    return groupSeries(
      daily,
      granularity,
      (items) => {
        const memoryMatch = Math.round(mean(items.map((i) => i.memoryMatch)));
        const clickCount = Math.round(mean(items.map((i) => i.clickCount)));
        const usageMinutes = Math.round(mean(items.map((i) => i.usageMinutes)));
        return {
          ...items[0],
          memoryMatch,
          clickCount,
          usageMinutes,
          label: formatTickLabel(items[0].date, granularity),
        };
      },
    ).map((d) => ({
      ...d,
      label: formatTickLabel(d.date, granularity),
    }));
  }, [filteredUnity, granularity]);

  const messages = useMemo(
    () => tabletMessages.filter((m) => m.elderId === elderId),
    [elderId],
  );

  const caregiverItems = useMemo(
    () => careLogs.filter((c) => c.elderId === elderId),
    [elderId],
  );

  const intervention = useMemo(() => {
    const dt = interventionDate ? parseISO(interventionDate) : null;
    if (!dt) return { before: chartData, after: [] as typeof chartData, dt: null as Date | null };
    const before = chartData.filter((d) => parseISO(d.date) < dt);
    const after = chartData.filter((d) => parseISO(d.date) >= dt);
    return { before, after, dt };
  }, [chartData, interventionDate]);

  const beforeAvg = useMemo(
    () => Math.round(mean(intervention.before.map((d) => d.memoryMatch))),
    [intervention.before],
  );
  const afterAvg = useMemo(
    () => Math.round(mean(intervention.after.map((d) => d.memoryMatch))),
    [intervention.after],
  );

  const goal = 70;
  const goalHitRate = useMemo(() => {
    const total = chartData.length || 0;
    if (!total) return 0;
    const hit = chartData.filter((d) => d.memoryMatch >= goal).length;
    return Math.round((hit / total) * 100);
  }, [chartData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/patients"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            返回長輩名單
          </Link>
          <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900">
            {elder ? `${elder.name}（Grandpa Wang）` : '長輩檔案'}
          </h1>
          <div className="mt-1 text-sm text-slate-600">
            {elder
              ? `${elder.age} 歲｜狀況：${elder.condition}｜資料來源：${elder.tags.join('、')}`
              : `找不到長輩：${elderId}`}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="danger">近 3 天低互動警示</Badge>
            <Badge variant="info">資料整合：Unity + App</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <SegmentedTabs
            value={granularity}
            onChange={setGranularity}
            items={[
              { value: 'day', label: '日' },
              { value: 'week', label: '週' },
              { value: 'month', label: '月' },
            ]}
          />
          <DateRangePicker value={range} onChange={setRange} />
        </div>
      </div>

      {/* Section 2: Unity Data Visualization */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tablet className="h-4 w-4 text-jhk-primary" />
              Unity 活動：認知遊戲成績（記憶配對）
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: 6, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="score"
                  domain={[0, 100]}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                  }}
                  labelFormatter={(_, payload) => {
                    const d = payload?.[0]?.payload?.date;
                    return d ? format(parseISO(d), 'PP', { locale: zhTW }) : '';
                  }}
                  formatter={(value: unknown, name?: string) => {
                    const n = name ?? '';
                    if (n === '記憶配對') return [`${value} 分`, '記憶配對'];
                    return [String(value), n];
                  }}
                />
                <Legend />
                <ReferenceLine
                  yAxisId="score"
                  y={goal}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  label={{ value: `治療目標：${goal}`, fill: '#059669', fontSize: 12 }}
                />
                <Line
                  yAxisId="score"
                  type="monotone"
                  dataKey="memoryMatch"
                  name="記憶配對"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-jhk-primary" />
              當期摘要
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">記憶配對平均</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {Math.round(mean(chartData.map((d) => d.memoryMatch)))} 分
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant={goalHitRate >= 60 ? 'success' : goalHitRate >= 40 ? 'warning' : 'danger'}>
                  目標達成率：{goalHitRate}%
                </Badge>
                <Badge variant="neutral">目標：{goal} 分</Badge>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                依目前篩選（{granularity === 'day' ? '日' : granularity === 'week' ? '週' : '月'}
                ）與日期區間計算
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">互動風險提示</div>
              <div className="mt-1 font-medium text-slate-900">近 3 天互動下降</div>
              <div className="mt-1 text-sm text-slate-600">
                建議確認設備可用性、提醒頻率與遊戲難度。
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tablet className="h-4 w-4 text-jhk-primary" />
              Unity 互動：點擊數 & 使用時間
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ left: 6, right: 10, top: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis
                  yAxisId="clicks"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  width={44}
                />
                <YAxis
                  yAxisId="mins"
                  orientation="right"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                  }}
                  labelFormatter={(_, payload) => {
                    const d = payload?.[0]?.payload?.date;
                    return d ? format(parseISO(d), 'PP', { locale: zhTW }) : '';
                  }}
                  formatter={(value: unknown, name?: string) => {
                    const n = name ?? '';
                    if (n === '點擊數') return [`${value} 次`, '點擊數'];
                    if (n === '使用時間') return [`${value} 分鐘`, '使用時間'];
                    return [String(value), n];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="clicks"
                  dataKey="clickCount"
                  name="點擊數"
                  fill="#2563EB"
                  radius={[10, 10, 0, 0]}
                  opacity={0.85}
                />
                <Bar
                  yAxisId="mins"
                  dataKey="usageMinutes"
                  name="使用時間"
                  fill="#059669"
                  radius={[10, 10, 0, 0]}
                  opacity={0.7}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-jhk-primary" />
              平板訊息（長輩 ↔ 照護者）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChatThread messages={messages} />
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Caregiver App Data Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-jhk-primary" />
            照護者 App：照護紀錄時間軸
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CareLogTimeline items={caregiverItems} />
        </CardContent>
      </Card>

      {/* Section 4: Analysis Module (Before & After) */}
      <Card>
        <CardHeader>
          <CardTitle>成效分析：介入日前後（Prescription vs. Result）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl text-sm text-slate-600">
              設定「介入日期」（例如新療程開始日）後，系統會把同一段期間的資料切成「介入前」與「介入後」做對照，快速判斷是否有改善或下滑。
            </div>
            <div className="w-[260px] max-w-full">
              <div className="text-xs font-medium text-slate-700">介入日期</div>
              <Input
                type="date"
                value={interventionDate}
                onChange={(e) => setInterventionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-jhk-line bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">介入前</div>
                <div className="text-xs text-slate-500">
                  平均：{beforeAvg} 分 · {intervention.before.length} 筆
                </div>
              </div>
              <div className="mt-3 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={intervention.before}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="memoryMatch"
                      stroke="#2563EB"
                      strokeWidth={2.25}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-jhk-line bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">介入後</div>
                <div className="text-xs text-slate-500">
                  平均：{afterAvg} 分 · {intervention.after.length} 筆
                </div>
              </div>
              <div className="mt-3 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={intervention.after}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="memoryMatch"
                      stroke="#059669"
                      strokeWidth={2.25}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-medium text-slate-900">解讀建議（示範）</div>
            <div className="mt-1 text-slate-600">
              若「介入後平均分數」較介入前明顯提升，且互動時間同步上升，可能代表療程有效；
              若分數上升但互動下降，需確認是否為短期波動或外在協助造成的偏差。
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

