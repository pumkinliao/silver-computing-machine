import { addDays, formatISO, startOfDay, subDays } from 'date-fns';

export type Elder = {
  id: string;
  name: string;
  age: number;
  condition: string;
  tags: string[];
};

export type UnityDailyActivity = {
  date: string; // ISO date (YYYY-MM-DD)
  gameScores: {
    memoryMatch: number;
  };
  interaction: {
    clickCount: number;
    usageMinutes: number;
  };
};

export type TabletMessage = {
  id: string;
  elderId: string;
  sender: 'elder' | 'caregiver';
  at: string; // ISO datetime
  text: string;
};

export type CareLogEntry =
  | {
      id: string;
      elderId: string;
      type: 'recording_summary';
      at: string;
      title: string;
      summary: string;
      durationMinutes: number;
      by: string;
    }
  | {
      id: string;
      elderId: string;
      type: 'therapy_note';
      at: string;
      title: string;
      note: string;
      by: string;
    }
  | {
      id: string;
      elderId: string;
      type: 'photo';
      at: string;
      title: string;
      caption: string;
      by: string;
      placeholder: true;
    }
  | {
      id: string;
      elderId: string;
      type: 'voice_memo';
      at: string;
      title: string;
      caption: string;
      by: string;
      placeholder: true;
      durationSeconds: number;
    };

export type Alert = {
  id: string;
  elderId: string;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  detail: string;
  createdAt: string; // ISO datetime
};

export const mockAdmin = {
  name: '管理員',
  org: '照護中心',
};

export const elders: Elder[] = [
  {
    id: 'grandpa-wang',
    name: '王爺爺',
    age: 82,
    condition: '輕度失智',
    tags: ['Unity 平板', '照護者 App'],
  },
  {
    id: 'grandma-chen',
    name: '陳奶奶',
    age: 79,
    condition: '輕度認知退化（觀察中）',
    tags: ['Unity 平板'],
  },
];

const SEED = [
  0.12, 0.41, 0.18, 0.33, 0.06, 0.49, 0.22, 0.15, 0.38, 0.27, 0.04, 0.31,
  0.45, 0.19, 0.09, 0.52, 0.24, 0.17, 0.36, 0.28, 0.07, 0.43, 0.21, 0.14,
  0.39, 0.26, 0.11, 0.34, 0.05, 0.46,
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isoDate(d: Date) {
  return formatISO(d, { representation: 'date' });
}

export function unityDailyActivityForElder(elderId: string): UnityDailyActivity[] {
  // 30 days daily series, deterministic & “realistic” fluctuations.
  const today = startOfDay(new Date());
  const start = subDays(today, 29);

  const baseScore = elderId === 'grandpa-wang' ? 62 : 70;
  const baseClicks = elderId === 'grandpa-wang' ? 92 : 110;
  const baseUsage = elderId === 'grandpa-wang' ? 18 : 22;

  const series: UnityDailyActivity[] = [];
  for (let i = 0; i < 30; i++) {
    const date = addDays(start, i);
    const noise = SEED[i] - 0.25; // [-0.25..~0.27]

    // Grandpa Wang: slight drop last 3 days (low interaction flag)
    const lowInteractionFactor =
      elderId === 'grandpa-wang' && i >= 27 ? 0.55 : 1.0;

    const scoreTrend = elderId === 'grandpa-wang' ? Math.sin(i / 5) * 5 : Math.sin(i / 6) * 4;

    const memoryMatch = clamp(
      Math.round(baseScore + scoreTrend + noise * 18),
      20,
      100,
    );

    const clickCount = clamp(
      Math.round((baseClicks + noise * 60 + Math.cos(i / 4) * 10) * lowInteractionFactor),
      0,
      240,
    );

    const usageMinutes = clamp(
      Math.round((baseUsage + noise * 18 + Math.sin(i / 3) * 3) * lowInteractionFactor),
      0,
      90,
    );

    series.push({
      date: isoDate(date),
      gameScores: { memoryMatch },
      interaction: { clickCount, usageMinutes },
    });
  }
  return series;
}

export const tabletMessages: TabletMessage[] = [
  {
    id: 'm1',
    elderId: 'grandpa-wang',
    sender: 'elder',
    at: formatISO(subDays(new Date(), 2)),
    text: '今天我有玩記憶配對，可是有點難。',
  },
  {
    id: 'm2',
    elderId: 'grandpa-wang',
    sender: 'caregiver',
    at: formatISO(subDays(new Date(), 2)),
    text: '沒關係，我們慢慢來～你做得很好。',
  },
  {
    id: 'm3',
    elderId: 'grandpa-wang',
    sender: 'elder',
    at: formatISO(subDays(new Date(), 1)),
    text: '我想起小時候在鄉下的事情。',
  },
];

export const careLogs: CareLogEntry[] = [
  {
    id: 'c1',
    elderId: 'grandpa-wang',
    type: 'recording_summary',
    at: formatISO(subDays(new Date(), 1)),
    title: '一鍵錄音（20 分鐘）',
    durationMinutes: 20,
    by: '家屬（小王）',
    summary:
      '錄了一段 20 分鐘對話。摘要：長輩談起童年回憶，內容連貫；情緒穩定，偶有停頓但可在提示下繼續。',
  },
  {
    id: 'c2',
    elderId: 'grandpa-wang',
    type: 'therapy_note',
    at: formatISO(subDays(new Date(), 1)),
    title: '治療師備註',
    by: '職能治療師',
    note: '建議下週起將「記憶配對」難度由 3×4 調整為 4×4，但延長提示時間，以觀察挫折反應與專注續航。',
  },
  {
    id: 'c3',
    elderId: 'grandpa-wang',
    type: 'photo',
    at: formatISO(subDays(new Date(), 4)),
    title: '照片（占位）',
    by: '照護者',
    caption: '餐後散步紀錄（示意）',
    placeholder: true,
  },
  {
    id: 'c4',
    elderId: 'grandpa-wang',
    type: 'voice_memo',
    at: formatISO(subDays(new Date(), 6)),
    title: '語音備忘錄（占位）',
    by: '家屬（小王）',
    caption: '提醒：晚上 8 點後避免咖啡因（示意）',
    placeholder: true,
    durationSeconds: 32,
  },
];

export const alerts: Alert[] = [
  {
    id: 'a1',
    elderId: 'grandpa-wang',
    severity: 'danger',
    title: '近 3 天互動頻率偏低',
    detail: 'Unity 平板點擊數與使用時間下降，可能是疲倦、挫折或設備未使用。',
    createdAt: formatISO(subDays(new Date(), 0)),
  },
];

export function getElder(elderId: string) {
  return elders.find((e) => e.id === elderId) ?? null;
}

