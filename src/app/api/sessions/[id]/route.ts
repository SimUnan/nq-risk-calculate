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
    
    // Build update object, only including fields that are provided
    const updateData: any = {};
    
    if (body.riskAmount !== undefined) updateData.riskAmount = body.riskAmount;
    if (body.contractType !== undefined) updateData.contractType = body.contractType;
    if (body.inputMode !== undefined) updateData.inputMode = body.inputMode;
    if (body.entryPrice !== undefined) updateData.entryPrice = body.entryPrice;
    if (body.stopPrice !== undefined) updateData.stopPrice = body.stopPrice;
    if (body.ticks !== undefined) updateData.ticks = body.ticks;
    if (body.rrRatio !== undefined) updateData.rrRatio = body.rrRatio;
    if (body.calculatedContracts !== undefined) updateData.calculatedContracts = body.calculatedContracts;
    if (body.actualRisk !== undefined) updateData.actualRisk = body.actualRisk;
    if (body.profitTarget !== undefined) updateData.profitTarget = body.profitTarget;
    if (body.actualProfit !== undefined) updateData.actualProfit = body.actualProfit;
    if (body.tradeStatus !== undefined) updateData.tradeStatus = body.tradeStatus;
    if (body.exitPrice !== undefined) updateData.exitPrice = body.exitPrice;
    if (body.tradingRules !== undefined) updateData.tradingRules = body.tradingRules;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedSession = await TradingSession.findByIdAndUpdate(
      id,
      updateData,
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