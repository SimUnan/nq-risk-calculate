'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

interface WeekStatsProps {
  weekStart: Date;
  weekEnd: Date;
}

interface WeekStats {
  totalTrades: number;
  wins: number;
  losses: number;
  breakevens: number;
  pending: number;
  winRate: string;
  totalPnL: number;
  avgRisk: number;
  bestTrade: number;
  worstTrade: number;
}

export function WeekStats({ weekStart, weekEnd }: WeekStatsProps) {
  const [stats, setStats] = useState<WeekStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeekStats();
  }, [weekStart, weekEnd]);

  const fetchWeekStats = async () => {
    setLoading(true);
    try {
      const startStr = weekStart.toISOString().split('T')[0];
      const endStr = weekEnd.toISOString().split('T')[0];
      
      const response = await fetch(`/api/sessions/week-stats?weekStart=${startStr}&weekEnd=${endStr}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching week stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card border-0">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalTrades === 0) {
    return (
      <Card className="bg-card border-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Week Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No trades this week</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show different message if trades exist but no actual P&L data
  const hasActualPnLData = stats.totalPnL !== 0 || (stats.wins > 0 || stats.losses > 0);
  
  if (!hasActualPnLData && stats.pending === stats.totalTrades) {
    return (
      <Card className="bg-card border-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Week Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-2xl font-bold text-yellow-500 mb-2">{stats.totalTrades}</div>
            <p>Trades planned</p>
            <p className="text-xs mt-2">Edit trades to add actual results</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isProfitable = stats.totalPnL > 0;

  return (
    <Card className="bg-card border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Week Stats
        </CardTitle>
        {hasActualPnLData && (
          <p className="text-xs text-muted-foreground">  
            Showing actual trade results only
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall P&L */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${
            isProfitable ? 'text-green-500' : stats.totalPnL < 0 ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {isProfitable ? '+' : ''}${stats.totalPnL.toFixed(0)}
          </div>
          <div className="text-sm text-muted-foreground">Total P&L</div>
        </div>

        {/* Win/Loss Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xl font-semibold">{stats.totalTrades}</div>
            <div className="text-xs text-muted-foreground">Total Trades</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-primary">{stats.winRate}</div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Wins</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-500/30">
              {stats.wins}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm">Losses</span>
            </div>
            <Badge variant="outline" className="text-red-600 border-red-500/30">
              {stats.losses}
            </Badge>
          </div>
        </div>

        {/* Additional Stats */}
        {(stats.breakevens > 0 || stats.pending > 0) && (
          <div className="grid grid-cols-2 gap-3">
            {stats.breakevens > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Breakeven</span>
                </div>
                <Badge variant="outline" className="text-muted-foreground">
                  {stats.breakevens}
                </Badge>
              </div>
            )}
            
            {stats.pending > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                  <span className="text-sm">Pending</span>
                </div>
                <Badge variant="outline" className="text-yellow-600 border-yellow-500/30">
                  {stats.pending}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Best/Worst Trades */}
        {(stats.bestTrade !== 0 || stats.worstTrade !== 0) && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="text-sm font-medium text-muted-foreground">Trade Range</div>
            <div className="grid grid-cols-2 gap-3">
              {stats.bestTrade > 0 && (
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <div className="text-sm font-semibold text-green-600">
                    +${stats.bestTrade.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Best</div>
                </div>
              )}
              
              {stats.worstTrade < 0 && (
                <div className="text-center p-3 rounded-lg bg-red-500/10">
                  <div className="text-sm font-semibold text-red-600">
                    ${stats.worstTrade.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Worst</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Average Risk */}
        <div className="text-center pt-4 border-t border-border/50">
          <div className="text-lg font-semibold">${stats.avgRisk}</div>
          <div className="text-xs text-muted-foreground">Avg Risk Per Trade</div>
        </div>
      </CardContent>
    </Card>
  );
}