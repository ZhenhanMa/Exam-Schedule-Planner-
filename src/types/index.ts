export type Category = 'study' | 'rest' | 'exercise' | 'other';

export interface ScheduleItem {
  id: string;
  time: string; // 时间段，如 "08:00-10:00"
  title: string; // 计划内容
  completed: boolean; // 是否完成
  category: Category; // 类别
}

export interface AppSettings {
  examDate: string; // 考研日期 YYYY-MM-DD
}

export interface AppData {
  plans: Record<string, ScheduleItem[]>; // 以日期为键的计划映射
  settings: AppSettings;
}

export type WeekView = 'thisWeek' | 'nextWeek';
