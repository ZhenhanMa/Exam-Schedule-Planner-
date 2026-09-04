import { useEffect, useState } from 'react';
import { formatDateLong, formatTime, getWeekday } from '@/utils/date';

/**
 * 中央日期时间显示组件
 * 实时显示当前日期（年月日+星期）与时间（时分秒）
 */
export default function CenterClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      {/* 日期 + 星期 */}
      <div className="flex items-baseline gap-4 mb-6 animate-[fadeInDown_0.8s_ease-out]">
        <span className="font-serif text-5xl md:text-6xl font-bold tracking-wide text-ivory/95">
          {formatDateLong(now)}
        </span>
        <span className="font-serif text-2xl md:text-3xl text-amber-400/80 tracking-widest">
          {getWeekday(now)}
        </span>
      </div>

      {/* 时钟 */}
      <div className="relative">
        <div className="absolute inset-0 blur-2xl bg-amber-500/10 rounded-full" aria-hidden />
        <div
          className="relative font-mono text-7xl md:text-8xl font-light tracking-tight text-ivory tabular-nums animate-[fadeIn_1s_ease-out]"
          style={{ textShadow: '0 0 40px rgba(251, 191, 36, 0.15)' }}
        >
          {formatTime(now)}
        </div>
      </div>

      {/* 呼吸光效指示器 */}
      <div className="mt-6 flex items-center gap-2 text-sm text-ivory/40">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="tracking-wider">实时更新</span>
      </div>
    </div>
  );
}
