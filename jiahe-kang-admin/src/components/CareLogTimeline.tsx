import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { FileAudio, Image, NotebookPen } from 'lucide-react';
import { cn } from '../lib/cn';
import type { CareLogEntry } from '../mock/data';
import { Badge } from './ui/Badge';

function iconFor(entry: CareLogEntry) {
  switch (entry.type) {
    case 'recording_summary':
      return <FileAudio className="h-4 w-4" />;
    case 'therapy_note':
      return <NotebookPen className="h-4 w-4" />;
    case 'photo':
      return <Image className="h-4 w-4" />;
    case 'voice_memo':
      return <FileAudio className="h-4 w-4" />;
  }
}

function badgeFor(entry: CareLogEntry) {
  switch (entry.type) {
    case 'recording_summary':
      return <Badge variant="info">錄音摘要</Badge>;
    case 'therapy_note':
      return <Badge variant="success">治療備註</Badge>;
    case 'photo':
      return <Badge variant="neutral">照片</Badge>;
    case 'voice_memo':
      return <Badge variant="neutral">語音</Badge>;
  }
}

export function CareLogTimeline({ items }: { items: CareLogEntry[] }) {
  const sorted = [...items].sort((a, b) => (a.at > b.at ? -1 : 1));

  return (
    <div className="space-y-4">
      {sorted.map((entry, idx) => (
        <div key={entry.id} className="relative flex gap-4">
          <div className="relative">
            <div
              className={cn(
                'grid h-9 w-9 place-items-center rounded-2xl border border-jhk-line bg-white text-slate-700 shadow-sm',
              )}
            >
              {iconFor(entry)}
            </div>
            {idx !== sorted.length - 1 ? (
              <div className="absolute left-1/2 top-10 h-[calc(100%-2.25rem)] w-px -translate-x-1/2 bg-jhk-line" />
            ) : null}
          </div>

          <div className="min-w-0 flex-1 rounded-2xl border border-jhk-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-medium text-slate-900">{entry.title}</div>
                  {badgeFor(entry)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {format(new Date(entry.at), 'PP p', { locale: zhTW })} · 上傳者：{entry.by}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-700">
              {entry.type === 'recording_summary' ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    時長：{entry.durationMinutes} 分鐘
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 leading-relaxed">
                    {entry.summary}
                  </div>
                </div>
              ) : entry.type === 'therapy_note' ? (
                <div className="rounded-xl bg-slate-50 p-3 leading-relaxed">
                  {entry.note}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900">
                      內容占位（Prototype）
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{entry.caption}</div>
                  </div>
                  <div className="shrink-0 rounded-xl border border-jhk-line bg-white px-3 py-2 text-xs text-slate-600">
                    {entry.type === 'photo'
                      ? '照片'
                      : `語音 · ${entry.durationSeconds} 秒`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

