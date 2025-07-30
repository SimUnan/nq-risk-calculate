import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';
import TradingSession from '@/models/TradingSession';

// GET - Fetch session summaries for calendar view
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    if (!month || !year) {
      return NextResponse.json({
        success: false,
        message: 'Month and year parameters are required',
      }, { status: 400 });
    }
    
    // Create date range for the entire month
    const startOfMonth = new Date(parseInt(year), parseInt(month), 1);
    const endOfMonth = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59, 999);
    
    const sessions = await TradingSession.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    }).lean();
    
    // Group sessions by day and calculate summaries
    const dailySummaries: { [key: string]: { sessionCount: number; totalProfit: number } } = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.createdAt);
      // Use local date format to avoid timezone issues
      const year = sessionDate.getFullYear();
      const month = String(sessionDate.getMonth() + 1).padStart(2, '0');
      const day = String(sessionDate.getDate()).padStart(2, '0');
      const dayKey = `${year}-${month}-${day}`;
      
      if (!dailySummaries[dayKey]) {
        dailySummaries[dayKey] = { sessionCount: 0, totalProfit: 0 };
      }
      
      dailySummaries[dayKey].sessionCount++;
      // ONLY use actual profit/loss data, ignore estimates
      if (session.actualProfit !== undefined && session.actualProfit !== null) {
        dailySummaries[dayKey].totalProfit += session.actualProfit;
      }
      // Don't add estimated P&L - only real trade results count
    });
    
    return NextResponse.json({
      success: true,
      summaries: dailySummaries,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching session summaries:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch session summaries',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}