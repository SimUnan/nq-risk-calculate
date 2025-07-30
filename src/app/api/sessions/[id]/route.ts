import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';
import TradingSession from '@/models/TradingSession';

// GET - Fetch single trading session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    
    const session = await TradingSession.findById(id).lean();
    
    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'Session not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      session,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch session',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// PUT - Update trading session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    
    const body = await request.json();
    
    const updatedSession = await TradingSession.findByIdAndUpdate(
      id,
      {
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
        notes: body.notes,
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedSession) {
      return NextResponse.json({
        success: false,
        message: 'Session not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session updated successfully!',
      session: updatedSession,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update session',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// DELETE - Delete trading session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    
    const deletedSession = await TradingSession.findByIdAndDelete(id);
    
    if (!deletedSession) {
      return NextResponse.json({
        success: false,
        message: 'Session not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully!',
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete session',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}