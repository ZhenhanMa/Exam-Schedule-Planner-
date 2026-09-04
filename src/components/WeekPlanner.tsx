import { useState } from 'react';
import { ChevronRight, Check, CalendarPlus } from 'lucide-react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { getWeekDates, formatDateKey, isToday, formatShortDate } from '@/utils/date';
import WeekToggle from './WeekToggle';
import ScheduleItemCard from './ScheduleItemCard';
import { cn } from '@/lib/utils';

interface WeekPlannerProps {
  /** 请求编辑某日（在右侧栏打开编辑面板） */
  onEditDay?: (dateKey: string) => void;
}

/**
 * 底部周计划编辑区
 * 横向7天卡片排列，支持本周/下周切换
 * 选定某日后点击共同添加按钮，在右侧栏生成编辑界面
 */
export default function WeekPlanner({ onEditDay }: WeekPlannerProps) {
  const weekView = useScheduleStore((s) => s.weekView);
  const plans = useScheduleStore((s) => s.plans);
  const deletePlan = useScheduleStore((s) => s.deletePlan);
  const togglePlanComplete = useScheduleStore((s) => s.togglePlanComplete);
  const updatePlan = useScheduleStore((s) => s.updatePlan);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const weekOffset = weekView === 'thisWeek' ? 0 : 1;
  const weekDates = getWeekDates(new Date(), weekOffset);

  const handleCommonAdd = () => {
    if (selectedDay && onEditDay) {
      onEditDay(selectedDay);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-ivory/10">
        <div>
          <h2 className="font-serif text-xl text-ivory font-bold">周计划</h2>
          <p className="text-xs text-ivory/40 mt-0.5">
            选定某日后点击「添加计划」在右侧编辑
          </p>
        </div>
        <div className="flex items-center gap-3">
          <WeekToggle />
          <button
            onClick={handleCommonAdd}
            disabled={!selectedDay}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              selectedDay
                ? 'bg-amber-500/90 text-slate-900 hover:bg-amber-400 shadow-md'
                : 'bg-ivory/5 text-ivory/30 cursor-not-allowed'
            )}
          >
            <CalendarPlus className="w-4 h-4" />
            添加计划
          </button>
        </div>
      </div>

      {/* 7天卡片 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scroll">
        <div className="flex gap-3 p-4 h-full min-w-max">
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date);
            const dayPlans = plans[dateKey] || [];
            const isCurrentDay = isToday(date);
            const isExpanded = expandedDay === dateKey;
            const isSelected = selectedDay === dateKey;
            const completedCount = dayPlans.filter((p) => p.completed).length;

            return (
              <div
                key={dateKey}
                onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                className={cn(
                  'flex flex-col rounded-xl border transition-all duration-200 min-w-[200px] max-w-[240px] flex-1 cursor-pointer',
                  isSelected
                    ? 'border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/30'
                    : isCurrentDay
                    ? 'border-amber-500/40 bg-amber-500/5'
                    : 'border-ivory/10 bg-slate-800/30 hover:bg-slate-800/50'
                )}
              >
                {/* 日期头 */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-ivory/5">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                    )}
                    <div className="text-left">
                      <div className={cn(
                        'text-sm font-bold',
                        isCurrentDay ? 'text-amber-400' : 'text-ivory/80'
                      )}>
                        {formatShortDate(date)}
                      </div>
                      <div className="text-[10px] text-ivory/30 font-mono mt-0.5">
                        {dayPlans.length > 0 ? `${completedCount}/${dayPlans.length} 完成` : '无计划'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDay(isExpanded ? null : dateKey);
                    }}
                    className="p-1 rounded hover:bg-ivory/5 transition-colors"
                    aria-label="展开/收起"
                  >
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 text-ivory/30 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </button>
                </div>

                {/* 计划列表 */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scroll">
                  {dayPlans.length === 0 ? (
                    <div className="text-center py-4 text-xs text-ivory/20">
                      {isSelected ? '已选中，点上方按钮添加' : '点击选中此日'}
                    </div>
                  ) : (
                    dayPlans
                      .slice()
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((item) => (
                        <ScheduleItemCard
                          key={item.id}
                          item={item}
                          onToggle={() => togglePlanComplete(dateKey, item.id)}
                          onDelete={() => deletePlan(dateKey, item.id)}
                          onUpdate={(updates) => updatePlan(dateKey, item.id, updates)}
                          compact
                        />
                      ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
