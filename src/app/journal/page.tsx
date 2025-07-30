'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/journal/calendar-view';
import { SessionList } from '@/components/journal/session-list';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useAlertModal } from '@/components/ui/alert-modal';
import { useConfirmModal } from '@/components/ui/confirm-modal';
import { TrendingUp, Calculator } from 'lucide-react';
import { ITradingSession } from '@/models/TradingSession';
import Link from 'next/link';

export default function JournalPage() {
  const [sessions, setSessions] = useState<ITradingSession[]>([]);
  const [dailySummaries, setDailySummaries] = useState<{ [key: string]: { sessionCount: number; totalProfit: number } }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Default to today
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  const { showAlert, AlertComponent } = useAlertModal();
  const { showConfirm, ConfirmComponent } = useConfirmModal();

  // Fetch session summaries for calendar on mount
  useEffect(() => {
    fetchSessionSummaries(new Date());
    fetchSessionsForDate(new Date()); // Load today's sessions by default
  }, []);

  const fetchSessionSummaries = async (date: Date) => {
    try {
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const response = await fetch(`/api/sessions/summary?month=${month}&year=${year}`);
      const data = await response.json();
      
      if (data.success) {
        setDailySummaries(data.summaries);
      } else {
        console.error('Failed to fetch session summaries:', data.message);
      }
    } catch (error) {
      console.error('Error fetching session summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessionsForDate = async (date: Date) => {
    setSessionsLoading(true);
    try {
      // Use local date format to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const response = await fetch(`/api/sessions?date=${dateStr}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      } else {
        console.error('Failed to fetch sessions:', data.message);
        setSessions([]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    fetchSessionsForDate(date);
  };

  const handleMonthChange = (date: Date) => {
    fetchSessionSummaries(date);
  };

  const handleEdit = (session: ITradingSession) => {
    // TODO: Implement edit functionality
    console.log('Edit session:', session);
    showAlert('Coming Soon', 'Edit functionality is coming soon!', 'info');
  };

  const handleDelete = async (sessionId: string) => {
    showConfirm(
      'Delete Session',
      'Are you sure you want to delete this trading session? This action cannot be undone.',
      async () => {
        try {
          const response = await fetch(`/api/sessions/${sessionId}`, {
            method: 'DELETE',
          });

          const data = await response.json();

          if (data.success) {
            // Remove from local state
            setSessions(prev => prev.filter(s => s._id?.toString() !== sessionId));
            showAlert('Success', 'Session deleted successfully!', 'success');
            // Refresh summaries to update calendar
            fetchSessionSummaries(selectedDate);
          } else {
            throw new Error(data.message || 'Failed to delete session');
          }
        } catch (error) {
          console.error('Error deleting session:', error);
          showAlert('Error', 'Failed to delete session. Please try again.', 'error');
        }
      },
      {
        confirmLabel: 'Delete',
        variant: 'destructive'
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading your trading journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trading Journal</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                View and manage your trading sessions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-2 text-xs sm:text-sm">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Calculator</span>
                <span className="sm:hidden">Calculator</span>
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CalendarView
            sessions={sessions}
            dailySummaries={dailySummaries}
            onDayClick={handleDayClick}
            onMonthChange={handleMonthChange}
            selectedDate={selectedDate}
          />
          
          <SessionList
            sessions={sessions}
            selectedDate={selectedDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={() => fetchSessionsForDate(selectedDate)}
            loading={sessionsLoading}
          />
        </div>
              </div>
      
      <AlertComponent />
      <ConfirmComponent />
    </div>
  );
}