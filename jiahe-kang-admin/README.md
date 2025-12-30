# 家賀康｜管理後台原型（Jia He Kang）

高擬真「長照整合管理後台」前端原型（**繁體中文**），以 **Mock Data** 模擬真實情境，重點示範：

- **Unity 平板（長輩端）**：認知遊戲成績、點擊數/使用時間、訊息
- **照護者 App（家屬/照護端）**：一鍵錄音摘要、治療備註、照片/語音（占位）、訊息
- **介入日前後分析**：用「介入日期」把數據切成 Before/After，快速驗證療程效果（Prescription vs. Result）

## 技術棧

- **React + TypeScript（Vite）**
- **Tailwind CSS**（清爽醫療/照護配色：藍、綠、白）
- **Recharts**（互動式 hover tooltip）
- **Lucide Icons**
- **React Router**
- **React Day Picker**（日期區間）

## 開發/建置

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## 路由

- `/`：總覽儀表板（指標 + 特別關注）
- `/patients`：長輩管理（示範名單）
- `/patients/grandpa-wang`：**長輩個人檔案（核心示範）**
- `/care-logs`：照護紀錄（占位頁）
- `/analytics`：數據分析（占位頁）
- `/settings`：設定（占位頁）

## 重要檔案

- `src/mock/data.ts`：Mock Data（王爺爺 82 歲、輕度失智；Unity 每日記憶配對分數；照護者昨日 20 分鐘錄音摘要；近 3 天低互動警示）
- `src/pages/DashboardOverview.tsx`：主儀表板
- `src/pages/PatientDetail.tsx`：長輩個人檔案（整合視圖 + Before/After）

