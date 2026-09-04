import { useScheduleStore } from '@/store/useScheduleStore';
import type { WeekView } from '@/types';
import { cn } from '@/lib/utils';

/**
 * 本周/下周切换组件
 */
export default function WeekToggle() {
  const weekView = useScheduleStore((s) => s.weekView);
  const setWeekView = useScheduleStore((s) => s.setWeekView);

  const views: { key: WeekView; label: string }[] = [
    { key: 'thisWeek', label: '本周' },
    { key: 'nextWeek', label: '下周' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-slate-800/50 rounded-lg p-1 border border-ivory/10">
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => setWeekView(view.key)}
          className={cn(
            'px-5 py-1.5 rounded-md text-sm font-medium transition-all',
            weekView === view.key
              ? 'bg-amber-500/90 text-slate-900 shadow-md'
              : 'text-ivory/50 hover:text-ivory/80'
          )}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}
