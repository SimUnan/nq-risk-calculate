'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteSessionDialog } from "./delete-session-dialog";
import { Edit, Trash2, TrendingUp, DollarSign } from "lucide-react";
import { ITradingSession } from "@/models/TradingSession";
import { formatDate, formatDateShort } from "@/utils/date-helpers";

interface SessionListProps {
  sessions: ITradingSession[];
  selectedDate?: Date;
  loading?: boolean;
  onEdit: (session: ITradingSession) => void;
  onDelete: (sessionId: string) => void;
}

export function SessionList({ sessions, selectedDate, loading, onEdit, onDelete }: SessionListProps) {
  const [sessionToDelete, setSessionToDelete] = useState<ITradingSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter sessions by selected date
  const filteredSessions = selectedDate
    ? sessions.filter(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate.toDateString() === selectedDate.toDateString();
      })
    : sessions;

  const sortedSessions = filteredSessions.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDeleteClick = (session: ITradingSession) => {
    setSessionToDelete(session);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(sessionToDelete._id?.toString() || '');
      setSessionToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setSessionToDelete(null);
  };

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 animate-pulse" />
            {selectedDate ? `Sessions for ${formatDate(selectedDate)}` : 'All Trading Sessions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 animate-pulse" />
            <p>Loading sessions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sortedSessions.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {selectedDate ? `Sessions for ${formatDate(selectedDate)}` : 'All Trading Sessions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trading sessions found{selectedDate ? ' for this date' : ''}.</p>
            <p className="text-sm mt-2">Start by saving a session from the calculator!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {selectedDate ? `Sessions for ${formatDate(selectedDate)}` : 'All Trading Sessions'}
          <Badge variant="secondary" className="ml-2">
            {sortedSessions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSessions.map((session) => (
          <div
            key={session._id?.toString()}
            className="group p-6 rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:from-card/90 hover:to-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={session.contractType === 'micro' ? 'default' : 'secondary'}>
                  {session.contractType === 'micro' ? 'MNQ' : 'NQ'}
                </Badge>
                <Badge variant="outline">
                  {session.inputMode === 'ticks' ? `${session.ticks} ticks` : 'Price Range'}
                </Badge>
                {session.rrRatio && (
                  <Badge variant="outline">
                    {session.rrRatio}:1 RR
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(session)}
                  className="gap-2 hover:bg-primary/10 hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(session)}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Risk Amount</div>
                <div className="font-semibold text-lg flex items-center gap-1 mt-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {session.riskAmount}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Contracts</div>
                <div className="font-bold text-2xl text-primary mt-1">
                  {session.calculatedContracts}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Actual Risk</div>
                <div className="font-semibold text-lg text-destructive mt-1">
                  ${session.actualRisk?.toFixed(2)}
                </div>
              </div>
              
              {session.profitTarget && (
                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Profit Target</div>
                  <div className="font-semibold text-lg text-green-500 mt-1">
                    ${session.profitTarget.toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            {session.notes && (
              <div className="mb-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Notes</div>
                <div className="text-sm bg-muted/20 border border-border/30 p-3 rounded-lg">
                  {session.notes}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Created: {formatDateShort(new Date(session.createdAt))} at{' '}
                {new Date(session.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              
              <div className="flex items-center gap-4">
                {Object.entries(session.tradingRules).map(([rule, checked]) => (
                  checked && (
                    <span key={rule} className="text-green-600">
                      ✓ {rule.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <DeleteSessionDialog
          session={sessionToDelete}
          open={!!sessionToDelete}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
}