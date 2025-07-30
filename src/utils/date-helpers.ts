// Date utility functions for the journal calendar

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

export function getWeeksInMonth(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks: Date[][] = [];
  
  let currentWeek: Date[] = [];
  
  // Start from the first day of the month
  const current = new Date(firstDay);
  
  // Add empty cells for days before the first of the month
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyDate = new Date(current);
    emptyDate.setDate(current.getDate() - (startDayOfWeek - i));
    currentWeek.push(emptyDate);
  }
  
  // Add all days of the month
  while (current <= lastDay) {
    currentWeek.push(new Date(current));
    
    // If we've completed a week (7 days), start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  // Fill remaining days of the last week
  while (currentWeek.length < 7) {
    currentWeek.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  return weeks;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function getWeekNumber(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysDiff = Math.ceil((date.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24));
  return Math.ceil((daysDiff + firstDayOfMonth.getDay()) / 7);
}