import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';
import TradingSession from '@/models/TradingSession';

// GET - Fetch weekly statistics
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get('weekStart');
    const weekEnd = searchParams.get('weekEnd');
    
    if (!weekStart || !weekEnd) {
      return NextResponse.json({
        success: false,
        message: 'Week start and end dates are required',
      }, { status: 400 });
    }
    
    // Parse dates
    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    endDate.setHours(23, 59, 59, 999);
    
    const sessions = await TradingSession.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).lean();
    
    // Calculate statistics
    const totalTrades = sessions.length;
    const wins = sessions.filter(s => s.tradeStatus === 'win').length;
    const losses = sessions.filter(s => s.tradeStatus === 'loss').length;
    const breakevens = sessions.filter(s => s.tradeStatus === 'breakeven').length;
    const pending = sessions.filter(s => s.tradeStatus === 'pending').length;
    
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) + '%' : '0%';
    
    // Calculate actual P&L (ONLY use actualProfit, ignore estimates)
    const totalPnL = sessions.reduce((sum, session) => {
      // Only include sessions with actual P&L data
      if (session.actualProfit !== undefined && session.actualProfit !== null) {
        return sum + session.actualProfit;
      }
      return sum;
    }, 0);
    
    // Only count sessions with actual results for completed trades
    const completedTrades = sessions.filter(s => 
      s.actualProfit !== undefined && s.actualProfit !== null && s.tradeStatus !== 'pending'
    ).length;
    
    // Average trade size
    const avgRisk = totalTrades > 0 ? 
      sessions.reduce((sum, s) => sum + s.riskAmount, 0) / totalTrades : 0;
    
    // Best and worst trades (only from sessions with actual P&L)
    const tradesWithActualPnL = sessions.filter(s => 
      s.actualProfit !== undefined && s.actualProfit !== null
    );
    
    const bestTrade = tradesWithActualPnL.length > 0 ? 
      tradesWithActualPnL.reduce((best, current) => 
        (current.actualProfit || 0) > (best.actualProfit || 0) ? current : best
      ) : null;
    
    const worstTrade = tradesWithActualPnL.length > 0 ? 
      tradesWithActualPnL.reduce((worst, current) => 
        (current.actualProfit || 0) < (worst.actualProfit || 0) ? current : worst
      ) : null;
    
    return NextResponse.json({
      success: true,
      stats: {
        totalTrades,
        wins,
        losses,
        breakevens,
        pending,
        winRate,
        totalPnL,
        avgRisk: Math.round(avgRisk),
        bestTrade: bestTrade?.actualProfit || 0,
        worstTrade: worstTrade?.actualProfit || 0,
        weekStart,
        weekEnd
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching week stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch week statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}