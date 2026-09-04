import { useState } from 'react';
import { Calendar, Settings, X } from 'lucide-react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { daysBetween } from '@/utils/date';

/**
 * 考研倒计时组件
 * 显示距离考研初试的剩余天数，支持自定义考研日期
 */
export default function ExamCountdown() {
  const examDate = useScheduleStore((s) => s.settings.examDate);
  const setExamDate = useScheduleStore((s) => s.setExamDate);
  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  const today = new Date();
  const exam = new Date(examDate + 'T00:00:00');
  const remainingDays = daysBetween(today, exam);

  const handleSave = () => {
    if (tempDate) {
      setExamDate(tempDate);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setTempDate(examDate);
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center mt-10 animate-[fadeInUp_1s_ease-out_0.3s_both]">
      <div className="text-sm tracking-[0.3em] text-ivory/40 uppercase mb-3">
        距离考研还有
      </div>

      <div className="relative group">
        {/* 光晕背景 */}
        <div className="absolute inset-0 blur-3xl bg-amber-500/20 rounded-full" aria-hidden />

        {/* 数字 */}
        <div className="relative flex items-baseline gap-3">
          <span
            className={`font-mono text-8xl md:text-9xl font-bold tabular-nums leading-none transition-colors ${
              remainingDays <= 30
                ? 'text-rose-400'
                : remainingDays <= 100
                ? 'text-amber-400'
                : 'text-amber-300'
            }`}
            style={{ textShadow: '0 0 60px rgba(251, 191, 36, 0.3)' }}
          >
            {remainingDays > 0 ? remainingDays : 0}
          </span>
          <span className="font-serif text-3xl text-ivory/60">天</span>
        </div>

        {/* 考研日期显示 */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-ivory/50">
          <Calendar className="w-4 h-4" />
          <span>考研日期：{examDate}</span>
          <button
            onClick={() => {
              setTempDate(examDate);
              setEditing(true);
            }}
            className="ml-1 p-1 rounded hover:bg-ivory/10 transition-colors text-ivory/40 hover:text-amber-400"
            aria-label="修改考研日期"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 编辑弹层 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={handleCancel}>
          <div
            className="bg-slate-900/95 border border-amber-500/20 rounded-2xl p-6 w-80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-ivory">设置考研日期</h3>
              <button onClick={handleCancel} className="text-ivory/40 hover:text-ivory transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className="w-full bg-slate-800 border border-ivory/10 rounded-lg px-4 py-3 text-ivory font-mono focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-lg border border-ivory/15 text-ivory/70 hover:bg-ivory/5 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg bg-amber-500/90 text-slate-900 font-medium hover:bg-amber-400 transition-colors text-sm"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
