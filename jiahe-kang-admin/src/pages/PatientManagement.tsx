import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { elders } from '../mock/data';

export default function PatientManagement() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">長輩管理</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          長輩名單
        </h1>
      </div>

      <div className="max-w-xl">
        <Input placeholder="搜尋長輩姓名／病況／照護者…" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>長輩（示範資料）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {elders.map((e) => (
            <Link
              key={e.id}
              to={e.id === 'grandpa-wang' ? '/patients/grandpa-wang' : '/patients'}
              className="block rounded-2xl border border-jhk-line bg-white p-4 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-slate-900">{e.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {e.age} 歲｜狀況：{e.condition}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.id === 'grandpa-wang' ? (
                      <Badge variant="danger">近 3 天低互動</Badge>
                    ) : (
                      <Badge variant="neutral">觀察中</Badge>
                    )}
                    {e.tags.map((t) => (
                      <Badge key={t} variant="info">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500">查看檔案 →</div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

