import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">設定</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          系統設定
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>提示</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          這裡會放置通知規則、權限與角色、資料來源串接狀態（Unity 平板／照護者 App）、以及警示門檻等設定。
        </CardContent>
      </Card>
    </div>
  );
}

