import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function CaregiverLogs() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">照護紀錄</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          照護者上傳紀錄
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>提示</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          此頁面將彙整照護者 App 的錄音摘要、專業治療備註、照片／語音備忘錄與訊息流。
          （目前以「王爺爺」的個人檔案頁作為核心示範）
        </CardContent>
      </Card>
    </div>
  );
}

