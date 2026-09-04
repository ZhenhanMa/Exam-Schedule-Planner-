import { useState } from 'react';
import { ChevronUp, ChevronDown, PanelRightClose, PanelRightOpen } from 'lucide-react';
import CenterClock from '@/components/CenterClock';
import ExamCountdown from '@/components/ExamCountdown';
import TodaySchedule from '@/components/TodaySchedule';
import WeekPlanner from '@/components/WeekPlanner';

/**
 * 主面板页面
 * 布局：上方（中央时间+倒计时 | 右侧当日安排竖栏），下方（周计划编辑区）
 * 支持收纳右侧栏和底部周计划，收纳后仅保留时间界面
 */
export default function Home() {
  const [collapsedToday, setCollapsedToday] = useState(false);
  const [collapsedWeek, setCollapsedWeek] = useState(false);
  const [editingDayKey, setEditingDayKey] = useState<string | null>(null);

  const handleEditDay = (dateKey: string) => {
    setEditingDayKey(dateKey);
    // 编辑时自动展开右侧栏
    setCollapsedToday(false);
  };

  const handleCloseEdit = () => {
    setEditingDayKey(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 overflow-hidden">
      {/* 装饰背景 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 上半部分：时间区 + 当日安排 */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* 左/中区：中央时间 + 倒计时 */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
          <CenterClock />
          <ExamCountdown />

          {/* 收纳切换按钮（左下角） */}
          <div className="absolute bottom-4 left-6 flex gap-2">
            <button
              onClick={() => setCollapsedWeek(!collapsedWeek)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-ivory/10 text-ivory/50 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs backdrop-blur-sm"
              title={collapsedWeek ? '展开周计划' : '收纳周计划'}
            >
              {collapsedWeek ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>周计划</span>
            </button>
            <button
              onClick={() => setCollapsedToday(!collapsedToday)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-ivory/10 text-ivory/50 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs backdrop-blur-sm"
              title={collapsedToday ? '展开今日安排' : '收纳今日安排'}
            >
              {collapsedToday ? <PanelRightOpen className="w-3.5 h-3.5" /> : <PanelRightClose className="w-3.5 h-3.5" />}
              <span>今日安排</span>
            </button>
          </div>
        </div>

        {/* 右侧：当日安排竖栏 / 编辑面板 */}
        {!collapsedToday && (
          <aside className="w-[360px] flex-shrink-0 border-l border-ivory/10 bg-slate-900/40 backdrop-blur-sm">
            {editingDayKey ? (
              <TodaySchedule
                dateKey={editingDayKey}
                editable
                onClose={handleCloseEdit}
              />
            ) : (
              <TodaySchedule />
            )}
          </aside>
        )}
      </div>

      {/* 下半部分：周计划编辑区 */}
      {!collapsedWeek && (
        <div className="h-[300px] flex-shrink-0 border-t border-ivory/10 bg-slate-900/30 backdrop-blur-sm relative z-10">
          <WeekPlanner onEditDay={handleEditDay} />
        </div>
      )}
    </div>
  );
}
