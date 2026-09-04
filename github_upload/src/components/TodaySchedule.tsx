import { useState } from 'react';
import { Plus, CalendarDays, ListChecks, X } from 'lucide-react';
import { useScheduleStore, getTodayKey } from '@/store/useScheduleStore';
import { formatDateKey, formatDateLong, getWeekday, isToday as isTodayDate } from '@/utils/date';
import ScheduleItemCard from './ScheduleItemCard';
import TimePicker from './TimePicker';
import type { Category, ScheduleItem } from '@/types';

const CATEGORIES: Category[] = ['study', 'rest', 'exercise', 'other'];
const EMPTY_PLANS: ScheduleItem[] = [];

interface TodayScheduleProps {
  /** 日期键 YYYY-MM-DD，默认今天 */
  dateKey?: string;
  /** 是否处于编辑模式（显示关闭按钮） */
  editable?: boolean;
  /** 编辑模式下的关闭回调 */
  onClose?: () => void;
}

/**
 * 右侧时间安排竖栏
 * 默认显示今日安排，editable 模式下可编辑任意日期并支持关闭
 */
export default function TodaySchedule({ dateKey, editable, onClose }: TodayScheduleProps) {
  const targetKey = dateKey || getTodayKey();
  const plans = useScheduleStore((s) => s.plans[targetKey] || EMPTY_PLANS);
  const addPlan = useScheduleStore((s) => s.addPlan);
  const deletePlan = useScheduleStore((s) => s.deletePlan);
  const togglePlanComplete = useScheduleStore((s) => s.togglePlanComplete);
  const updatePlan = useScheduleStore((s) => s.updatePlan);

  const [adding, setAdding] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('study');

  const targetDate = new Date(targetKey + 'T00:00:00');
  const isToday = isTodayDate(targetDate);

  const handleAdd = () => {
    if (newTitle.trim()) {
      addPlan(targetKey, {
        time: newTime || '全天',
        title: newTitle.trim(),
        completed: false,
        category: newCategory,
      });
      setNewTime('');
      setNewTitle('');
      setNewCategory('study');
      setAdding(false);
    }
  };

  const completedCount = plans.filter((p) => p.completed).length;
  const progress = plans.length > 0 ? Math.round((completedCount / plans.length) * 100) : 0;

  const title = editable ? `${formatDateLong(targetDate)} ${getWeekday(targetDate)}` : '今日安排';
  const subtitle = editable ? formatDateKey(targetDate) : formatDateKey(new Date());

  return (
    <div className="flex flex-col h-full">
      {/* 标题区 */}
      <div className="px-5 py-4 border-b border-ivory/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-xl text-ivory font-bold">{title}</h2>
          </div>
          {editable && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ivory/40 hover:text-amber-400 hover:bg-ivory/5 transition-colors"
              aria-label="关闭编辑"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-ivory/40 font-mono">{subtitle}</p>

        {/* 进度条 */}
        {plans.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-ivory/50 mb-1">
              <span className="flex items-center gap-1">
                <ListChecks className="w-3 h-3" />
                完成进度
              </span>
              <span className="font-mono">{completedCount}/{plans.length}</span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 计划列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 custom-scroll">
        {plans.length === 0 && !adding && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-ivory/5 flex items-center justify-center mb-3">
              <CalendarDays className="w-7 h-7 text-ivory/20" />
            </div>
            <p className="text-sm text-ivory/30">{isToday ? '今日暂无安排' : '该日暂无安排'}</p>
            <p className="text-xs text-ivory/20 mt-1">点击下方按钮添加计划</p>
          </div>
        )}

        {plans
          .slice()
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((item) => (
            <ScheduleItemCard
              key={item.id}
              item={item}
              onToggle={() => togglePlanComplete(targetKey, item.id)}
              onDelete={() => deletePlan(targetKey, item.id)}
              onUpdate={(updates) => updatePlan(targetKey, item.id, updates)}
              compact
            />
          ))}

        {/* 新增表单 */}
        {adding && (
          <div className="rounded-xl border border-amber-500/30 bg-slate-800/80 p-3 space-y-2.5 animate-[fadeIn_0.2s_ease-out]">
            <TimePicker value={newTime} onChange={setNewTime} />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="计划内容"
              className="w-full bg-slate-900/60 border border-ivory/10 rounded-md px-2 py-1.5 text-sm text-ivory focus:outline-none focus:border-amber-500/50"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      newCategory === cat
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-ivory/40 hover:text-ivory/70'
                    }`}
                  >
                    {cat === 'study' ? '学习' : cat === 'rest' ? '休息' : cat === 'exercise' ? '运动' : '其他'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAdding(false);
                    setNewTime('');
                    setNewTitle('');
                  }}
                  className="text-xs text-ivory/40 hover:text-ivory/70 px-2 py-1 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="text-xs bg-amber-500/90 text-slate-900 font-medium px-3 py-1 rounded hover:bg-amber-400 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部新增按钮 */}
      <div className="p-4 border-t border-ivory/10">
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-ivory/20 text-ivory/50 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          {isToday ? '添加今日计划' : '添加计划'}
        </button>
      </div>
    </div>
  );
}
