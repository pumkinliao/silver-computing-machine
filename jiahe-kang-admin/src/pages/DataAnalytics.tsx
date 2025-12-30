import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function DataAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-slate-500">數據分析</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          系統分析與報表
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>提示</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          此區會提供跨長輩的互動趨勢、風險分層、介入成效追蹤等圖表。示範版先把重點放在「長輩檔案」的整合分析。
        </CardContent>
      </Card>
    </div>
  );
}

