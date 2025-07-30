'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { getMonthName, getWeeksInMonth, isSameDay } from "@/utils/date-helpers";
import { ITradingSession } from "@/models/TradingSession";
import { DaySummary } from "./day-summary";

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

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>
              {view === 'month' ? (
                `${getMonthName(month)} ${year}`
              ) : (
                `${getMonthName(month)} ${year} - Week ${selectedWeek + 1}`
              )}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {view === 'week' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView('month')}
              >
                Back to Month
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              disabled={view === 'week'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
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
          <div className="space-y-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Week {weekIndex + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleWeekClick(weekIndex)}
                    className="text-xs"
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
            ))}
          </div>
        ) : (
          // Week view
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-muted-foreground">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            
            <div className="grid grid-cols-7 gap-3">
              {weeks[selectedWeek]?.map((date, dayIndex) => {
                const { sessionCount, totalProfit } = getDaySummary(date);
                
                return (
                  <div key={dayIndex} className="min-h-[140px]">
                    <DaySummary
                      date={date}
                      sessionCount={sessionCount}
                      totalProfit={totalProfit}
                      isSelected={isSelected(date)}
                      isToday={isToday(date)}
                      isCurrentMonth={isCurrentMonth(date)}
                      onClick={() => handleDayClick(date)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}