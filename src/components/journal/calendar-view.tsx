'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { getMonthName, getWeeksInMonth, isSameDay } from "@/utils/date-helpers";
import { ITradingSession } from "@/models/TradingSession";
import { DaySummary } from "./day-summary";
import { WeekStats } from "./week-stats";

interface CalendarViewProps {
  sessions: ITradingSession[];
  dailySummaries: { [key: string]: { sessionCount: number; totalProfit: number } };
  onDayClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  selectedDate?: Date;
}

export function CalendarView({ sessions, dailySummaries, onDayClick, onMonthChange, selectedDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const weeks = getWeeksInMonth(year, month);

  // Get summary for a specific day
  const getDaySummary = (date: Date) => {
    // Use local date format to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayKey = `${year}-${month}-${day}`;
    return dailySummaries[dayKey] || { sessionCount: 0, totalProfit: 0 };
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    setCurrentDate(newDate);
    setView('month');
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    setCurrentDate(newDate);
    setView('month');
    onMonthChange(newDate);
  };

  const handleWeekClick = (weekIndex: number) => {
    setSelectedWeek(weekIndex);
    setView('week');
  };

  const handleDayClick = (date: Date) => {
    // Only count days that are in the current month
    if (date.getMonth() === month) {
      onDayClick(date);
    }
  };

  const isCurrentMonth = (date: Date) => date.getMonth() === month;
  const isToday = (date: Date) => isSameDay(date, new Date());
  const isSelected:any = (date: Date) => selectedDate && isSameDay(date, selectedDate);

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setView('month');
    onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1));
    // Auto-select today
    onDayClick(today);
  };

  const getWeekTotal = (week: Date[]) => {
    return week.reduce((total, date) => {
      if (date.getMonth() === month) {
        const { totalProfit } = getDaySummary(date);
        return total + totalProfit;
      }
      return total;
    }, 0);
  };

  return (
    <Card className="bg-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {view === 'month' ? (
              `${getMonthName(month)} ${year}`
            ) : (
              `${getMonthName(month)} ${year} - Week ${selectedWeek + 1}`
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="text-sm"
            >
              Today
            </Button>
            
            {view === 'week' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('month')}
                className="text-sm"
              >
                Back to Month
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              disabled={view === 'week'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              disabled={view === 'week'}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {view === 'month' ? (
          <div className="space-y-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            {/* Calendar Grid */}
            <div className="space-y-3">
              {weeks.map((week, weekIndex) => {
                const weekTotal = getWeekTotal(week);
                const weekTotalFormatted = weekTotal >= 0 ? `+$${weekTotal.toFixed(0)}` : `-$${Math.abs(weekTotal).toFixed(0)}`;
                
                return (
                  <div key={weekIndex} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground">
                          Week {weekIndex + 1}
                        </span>
                        {weekTotal !== 0 && (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            weekTotal > 0 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {weekTotalFormatted}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWeekClick(weekIndex)}
                        className="text-xs h-6 px-2 hover:bg-primary/10"
                      >
                        View Week
                      </Button>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                    {week.map((date, dayIndex) => {
                      const { sessionCount, totalProfit } = getDaySummary(date);
                      return (
                        <DaySummary
                          key={dayIndex}
                          date={date}
                          sessionCount={sessionCount}
                          totalProfit={totalProfit}
                          isSelected={isSelected(date)}
                          isToday={isToday(date)}
                          isCurrentMonth={isCurrentMonth(date)}
                          onClick={() => handleDayClick(date)}
                        />
                      );
                    })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Week view
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weeks[selectedWeek]?.map((date, dayIndex) => {
                  const { sessionCount, totalProfit } = getDaySummary(date);
                  return (
                    <DaySummary
                      key={dayIndex}
                      date={date}
                      sessionCount={sessionCount}
                      totalProfit={totalProfit}
                      isSelected={isSelected(date)}
                      isToday={isToday(date)}
                      isCurrentMonth={isCurrentMonth(date)}
                      onClick={() => handleDayClick(date)}
                    />
                  );
                })}
              </div>
            </div>
            
            <WeekStats 
              weekStart={weeks[selectedWeek]?.[0] || new Date()}
              weekEnd={weeks[selectedWeek]?.[6] || new Date()}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}