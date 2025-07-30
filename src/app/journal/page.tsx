'use client';

import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/journal/calendar-view';
import { SessionList } from '@/components/journal/session-list';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator } from 'lucide-react';
import { ITradingSession } from '@/models/TradingSession';
import Link from 'next/link';

export default function JournalPage() {
  const [sessions, setSessions] = useState<ITradingSession[]>([]);
  const [dailySummaries, setDailySummaries] = useState<{ [key: string]: { sessionCount: number; totalProfit: number } }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Default to today
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);

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
    alert('Edit functionality coming soon!');
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setSessions(prev => prev.filter(s => s._id?.toString() !== sessionId));
        alert('Session deleted successfully!');
      } else {
        throw new Error(data.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session. Please try again.');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
              <p className="text-muted-foreground">
                View and manage your trading sessions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Calculator className="h-4 w-4" />
                Back to Calculator
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
            loading={sessionsLoading}
          />
        </div>
        
        {sessions.length === 0 && (
          <div className="text-center py-16">
            <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-semibold mb-4">No Trading Sessions Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by saving your first trading session from the calculator!
            </p>
            <Link href="/">
              <Button className="gap-2">
                <Calculator className="h-4 w-4" />
                Go to Calculator
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}