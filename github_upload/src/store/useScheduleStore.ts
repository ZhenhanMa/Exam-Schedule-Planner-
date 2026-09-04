import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScheduleItem, AppSettings, WeekView, Category } from '@/types';
import { getDefaultExamDate, formatDateKey } from '@/utils/date';

interface ScheduleState {
  // 数据
  plans: Record<string, ScheduleItem[]>;
  settings: AppSettings;
  weekView: WeekView;

  // 计划操作
  addPlan: (dateKey: string, item: Omit<ScheduleItem, 'id'>) => void;
  updatePlan: (dateKey: string, itemId: string, updates: Partial<ScheduleItem>) => void;
  deletePlan: (dateKey: string, itemId: string) => void;
  togglePlanComplete: (dateKey: string, itemId: string) => void;
  getPlans: (dateKey: string) => ScheduleItem[];

  // 设置操作
  setExamDate: (date: string) => void;

  // 视图操作
  setWeekView: (view: WeekView) => void;
  toggleWeekView: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      plans: {},
      settings: {
        examDate: getDefaultExamDate(),
      },
      weekView: 'thisWeek',

      addPlan: (dateKey, item) =>
        set((state) => {
          const dayPlans = state.plans[dateKey] || [];
          const newItem: ScheduleItem = { ...item, id: generateId() };
          return {
            plans: {
              ...state.plans,
              [dateKey]: [...dayPlans, newItem],
            },
          };
        }),

      updatePlan: (dateKey, itemId, updates) =>
        set((state) => {
          const dayPlans = state.plans[dateKey] || [];
          return {
            plans: {
              ...state.plans,
              [dateKey]: dayPlans.map((p) => (p.id === itemId ? { ...p, ...updates } : p)),
            },
          };
        }),

      deletePlan: (dateKey, itemId) =>
        set((state) => {
          const dayPlans = state.plans[dateKey] || [];
          return {
            plans: {
              ...state.plans,
              [dateKey]: dayPlans.filter((p) => p.id !== itemId),
            },
          };
        }),

      togglePlanComplete: (dateKey, itemId) =>
        set((state) => {
          const dayPlans = state.plans[dateKey] || [];
          return {
            plans: {
              ...state.plans,
              [dateKey]: dayPlans.map((p) =>
                p.id === itemId ? { ...p, completed: !p.completed } : p
              ),
            },
          };
        }),

      getPlans: (dateKey) => {
        const state = get();
        return state.plans[dateKey] || [];
      },

      setExamDate: (date) =>
        set((state) => ({
          settings: { ...state.settings, examDate: date },
        })),

      setWeekView: (view) => set({ weekView: view }),

      toggleWeekView: () =>
        set((state) => ({
          weekView: state.weekView === 'thisWeek' ? 'nextWeek' : 'thisWeek',
        })),
    }),
    {
      name: 'exam-schedule-data',
      // 仅持久化 plans 和 settings，不持久化 weekView
      partialize: (state) => ({ plans: state.plans, settings: state.settings }),
    }
  )
);

/** 类别配置：颜色、标签 */
export const CATEGORY_CONFIG: Record<Category, { label: string; color: string; bgColor: string; borderColor: string }> = {
  study: {
    label: '学习',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  rest: {
    label: '休息',
    color: 'text-sky-300',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
  },
  exercise: {
    label: '运动',
    color: 'text-emerald-300',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  other: {
    label: '其他',
    color: 'text-violet-300',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
  },
};

/** 获取今日日期键 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}
