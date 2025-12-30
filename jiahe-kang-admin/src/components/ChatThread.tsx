import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '../lib/cn';
import type { TabletMessage } from '../mock/data';

export function ChatThread({ messages }: { messages: TabletMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const isElder = m.sender === 'elder';
        return (
          <div
            key={m.id}
            className={cn('flex', isElder ? 'justify-start' : 'justify-end')}
          >
            <div
              className={cn(
                'max-w-[86%] rounded-2xl border px-3 py-2 text-sm shadow-sm',
                isElder
                  ? 'border-jhk-line bg-white text-slate-900'
                  : 'border-jhk-primarySoft bg-jhk-primarySoft text-slate-900',
              )}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                {format(new Date(m.at), 'PP p', { locale: zhTW })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

