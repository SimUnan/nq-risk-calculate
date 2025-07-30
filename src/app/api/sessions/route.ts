import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';
import TradingSession from '@/models/TradingSession';

// GET - Fetch trading sessions by date
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let query = {};
    
    if (date) {
      // Parse the date and create date range for the entire day
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      query = {
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      };
    }
    
    const sessions = await TradingSession.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .lean();
    
    // Calculate summary statistics for the sessions
    const totalProfit = sessions.reduce((sum, session) => {
      // If session has profit target, use it; otherwise use negative actual risk (loss)
      return sum + (session.profitTarget || -session.actualRisk);
    }, 0);
    
    return NextResponse.json({
      success: true,
      sessions,
      summary: {
        sessionCount: sessions.length,
        totalProfit,
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST - Create new trading session
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate unique session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession = new TradingSession({
      sessionId,
      riskAmount: body.riskAmount,
      contractType: body.contractType,
      inputMode: body.inputMode,
      entryPrice: body.entryPrice,
      stopPrice: body.stopPrice,
      ticks: body.ticks,
      rrRatio: body.rrRatio,
      calculatedContracts: body.calculatedContracts,
      actualRisk: body.actualRisk,
      profitTarget: body.profitTarget,
      tradingRules: body.tradingRules,
      notes: body.notes || '',
    });
    
    const savedSession = await newSession.save();
    
    return NextResponse.json({
      success: true,
      message: 'Trading session saved successfully!',
      session: savedSession,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to save session',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}