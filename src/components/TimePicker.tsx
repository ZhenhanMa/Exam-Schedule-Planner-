import { useRef, useEffect, useState, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  /** 时间值，格式 "HH:MM-HH:MM" 或 "全天" */
  value: string;
  onChange: (value: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')); // 00, 05, 10, ... 55

const ITEM_HEIGHT = 32; // 每项高度 px
const VISIBLE_COUNT = 5; // 可见项数

/**
 * 解析时间字符串为 { startH, startM, endH, endM }
 */
function parseTime(value: string): { startH: number; startM: number; endH: number; endM: number } {
  const defaultVal = { startH: 8, startM: 0, endH: 10, endM: 0 };
  if (!value || value === '全天') return defaultVal;
  const parts = value.split('-');
  if (parts.length !== 2) return defaultVal;
  const [start, end] = parts;
  const [sh, sm] = start.trim().split(':').map(Number);
  const [eh, em] = end.trim().split(':').map(Number);
  return {
    startH: isNaN(sh) ? 8 : sh,
    startM: isNaN(sm) ? 0 : sm,
    endH: isNaN(eh) ? 10 : eh,
    endM: isNaN(em) ? 0 : em,
  };
}

/** 找到最接近的5分钟刻度索引 */
function nearestMinuteIndex(minute: number): number {
  const idx = Math.round(minute / 5);
  return Math.min(Math.max(idx, 0), 11);
}

/**
 * 单个滚动列
 */
function WheelColumn({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 滚动到指定位置
  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const list = listRef.current;
    if (!list) return;
    const targetTop = index * ITEM_HEIGHT;
    list.scrollTo({ top: targetTop, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // 初始定位 & 外部变化时定位
  useEffect(() => {
    scrollToIndex(selectedIndex, false);
  }, [selectedIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    isScrollingRef.current = true;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const scrollTop = list.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clamped = Math.min(Math.max(index, 0), items.length - 1);
      if (clamped !== selectedIndex) {
        onSelect(clamped);
      }
      // 吸附到最近项
      list.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
      isScrollingRef.current = false;
    }, 100);
  }, [items.length, onSelect, selectedIndex]);

  const handleClick = (index: number) => {
    onSelect(index);
    scrollToIndex(index, true);
  };

  const padding = (ITEM_HEIGHT * (VISIBLE_COUNT - 1)) / 2;

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
    >
      {/* 选中高亮区 */}
      <div
        className="absolute left-0 right-0 bg-amber-500/10 border-y border-amber-500/20 pointer-events-none z-10"
        style={{
          top: padding,
          height: ITEM_HEIGHT,
        }}
      />
      {/* 上下渐变遮罩 */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-slate-900/90 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none z-10" />

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll custom-scroll snap-y snap-mandatory"
        style={{ scrollPaddingTop: padding, paddingTop: padding, paddingBottom: padding }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            onClick={() => handleClick(index)}
            className={cn(
              'flex items-center justify-center cursor-pointer transition-colors snap-center',
              index === selectedIndex
                ? 'text-amber-400 font-bold'
                : 'text-ivory/40 hover:text-ivory/70'
            )}
            style={{ height: ITEM_HEIGHT }}
          >
            <span className="font-mono text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 滚动式时间选择器
 * 选择开始时间和结束时间，格式 "HH:MM-HH:MM"
 */
export default function TimePicker({ value, onChange }: TimePickerProps) {
  const parsed = parseTime(value);
  const [startH, setStartH] = useState(parsed.startH);
  const [startM, setStartM] = useState(parsed.startM);
  const [endH, setEndH] = useState(parsed.endH);
  const [endM, setEndM] = useState(parsed.endM);

  // 向上同步变化
  useEffect(() => {
    const newTime = `${HOURS[startH]}:${MINUTES[nearestMinuteIndex(startM)]}-${HOURS[endH]}:${MINUTES[nearestMinuteIndex(endM)]}`;
    if (newTime !== value) {
      onChange(newTime);
    }
  }, [startH, startM, endH, endM]); // eslint-disable-line react-hooks/exhaustive-deps

  const startMIndex = nearestMinuteIndex(startM);
  const endMIndex = nearestMinuteIndex(endM);

  return (
    <div className="bg-slate-900/60 border border-ivory/10 rounded-lg p-2.5 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-ivory/50 flex items-center gap-1">
          <Clock className="w-3 h-3" /> 开始
        </span>
        <span className="text-[11px] text-ivory/50 flex items-center gap-1">
          结束 <Clock className="w-3 h-3" />
        </span>
      </div>
      <div className="flex items-center gap-1">
        {/* 开始时间 */}
        <div className="flex-1 flex gap-0.5">
          <div className="flex-1">
            <WheelColumn
              items={HOURS}
              selectedIndex={startH}
              onSelect={(i) => setStartH(i)}
            />
          </div>
          <div className="flex items-center justify-center w-3">
            <span className="text-ivory/30 text-xs">:</span>
          </div>
          <div className="flex-1">
            <WheelColumn
              items={MINUTES}
              selectedIndex={startMIndex}
              onSelect={(i) => setStartM(i * 5)}
            />
          </div>
        </div>

        {/* 分隔 */}
        <div className="px-1 text-ivory/30 text-sm">~</div>

        {/* 结束时间 */}
        <div className="flex-1 flex gap-0.5">
          <div className="flex-1">
            <WheelColumn
              items={HOURS}
              selectedIndex={endH}
              onSelect={(i) => setEndH(i)}
            />
          </div>
          <div className="flex items-center justify-center w-3">
            <span className="text-ivory/30 text-xs">:</span>
          </div>
          <div className="flex-1">
            <WheelColumn
              items={MINUTES}
              selectedIndex={endMIndex}
              onSelect={(i) => setEndM(i * 5)}
            />
          </div>
        </div>
      </div>
      {/* 当前值预览 */}
      <div className="text-center text-xs font-mono text-amber-400/80 pt-1 border-t border-ivory/5">
        {HOURS[startH]}:{MINUTES[startMIndex]} ~ {HOURS[endH]}:{MINUTES[endMIndex]}
      </div>
    </div>
  );
}
