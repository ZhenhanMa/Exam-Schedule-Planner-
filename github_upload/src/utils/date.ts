/**
 * 日期工具函数
 */

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/** 格式化日期为 YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 获取中文星期 */
export function getWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

/** 获取当前日期的中文长格式：2026年9月4日 */
export function formatDateLong(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/** 获取当前时间 HH:MM:SS */
export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * 获取本周（以周一为起点）的7天日期数组
 * weekOffset: 0=本周, 1=下周
 */
export function getWeekDates(date: Date, weekOffset = 0): Date[] {
  const current = new Date(date);
  const day = current.getDay(); // 0=周日
  // 转换为以周一为起点的偏移量
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diff + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

/** 判断两个日期是否为同一天 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return formatDateKey(d1) === formatDateKey(d2);
}

/** 判断日期是否为今天 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** 计算两个日期间隔的天数（向下取整） */
export function daysBetween(from: Date, to: Date): number {
  const fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toTime = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.floor((toTime - fromTime) / (1000 * 60 * 60 * 24));
}

/** 获取默认考研日期：当年12月最后一个周六 */
export function getDefaultExamDate(): string {
  const now = new Date();
  let year = now.getFullYear();
  // 如果当前已过12月，使用明年
  if (now.getMonth() === 11 && now.getDate() > 25) {
    year += 1;
  }
  const dec = new Date(year, 11, 31);
  // 找12月最后一个周六
  while (dec.getDay() !== 6) {
    dec.setDate(dec.getDate() - 1);
  }
  return formatDateKey(dec);
}

/** 获取日期短标签：如 9/4 周五 */
export function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()} ${WEEKDAYS[date.getDay()]}`;
}
