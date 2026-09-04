import { useState } from 'react';
import { Check, Clock, Trash2, Pencil, X } from 'lucide-react';
import type { ScheduleItem, Category } from '@/types';
import { CATEGORY_CONFIG } from '@/store/useScheduleStore';
import TimePicker from './TimePicker';
import { cn } from '@/lib/utils';

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<ScheduleItem>) => void;
  compact?: boolean;
}

const CATEGORIES: Category[] = ['study', 'rest', 'exercise', 'other'];

/**
 * 单个计划项卡片
 * 支持勾选完成、编辑、删除
 */
export default function ScheduleItemCard({
  item,
  onToggle,
  onDelete,
  onUpdate,
  compact = false,
}: ScheduleItemCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editTime, setEditTime] = useState(item.time);
  const [editCategory, setEditCategory] = useState<Category>(item.category);
  const config = CATEGORY_CONFIG[item.category];

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate({ title: editTitle.trim(), time: editTime, category: editCategory });
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(item.title);
    setEditTime(item.time);
    setEditCategory(item.category);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={cn('rounded-xl border border-amber-500/30 bg-slate-800/80 p-3 space-y-2.5')}>
        <TimePicker value={editTime} onChange={setEditTime} />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="计划内容"
          className="w-full bg-slate-900/60 border border-ivory/10 rounded-md px-2 py-1.5 text-sm text-ivory focus:outline-none focus:border-amber-500/50"
          autoFocus
        />
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setEditCategory(cat)}
                className={cn(
                  'px-2 py-0.5 rounded text-xs transition-colors',
                  editCategory === cat
                    ? cn(CATEGORY_CONFIG[cat].bgColor, CATEGORY_CONFIG[cat].color, 'border', CATEGORY_CONFIG[cat].borderColor)
                    : 'text-ivory/40 hover:text-ivory/70'
                )}
              >
                {CATEGORY_CONFIG[cat].label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleCancel}
              className="p-1 rounded text-ivory/40 hover:text-ivory hover:bg-ivory/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="p-1 rounded text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-slate-800/40 transition-all duration-200',
        compact ? 'p-2.5' : 'p-3',
        item.completed
          ? 'border-emerald-500/20 opacity-60'
          : cn(config.borderColor, 'hover:bg-slate-800/70')
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* 勾选圆圈 */}
        <button
          onClick={onToggle}
          className={cn(
            'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
            item.completed
              ? 'border-emerald-400 bg-emerald-400/20'
              : 'border-ivory/25 hover:border-amber-400'
          )}
          aria-label={item.completed ? '标记未完成' : '标记完成'}
        >
          {item.completed && <Check className="w-3 h-3 text-emerald-300" />}
        </button>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Clock className={cn('w-3 h-3 flex-shrink-0', config.color)} />
            <span className={cn('text-xs font-mono', config.color)}>{item.time}</span>
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded', config.bgColor, config.color)}>
              {config.label}
            </span>
          </div>
          <p
            className={cn(
              'text-sm text-ivory/90 leading-snug',
              item.completed && 'line-through text-ivory/50'
            )}
          >
            {item.title}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-ivory/40 hover:text-amber-400 hover:bg-ivory/5 transition-colors"
            aria-label="编辑"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded text-ivory/40 hover:text-rose-400 hover:bg-ivory/5 transition-colors"
            aria-label="删除"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
