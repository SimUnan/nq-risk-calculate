import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/mongodb';
import TradingSession from '@/models/TradingSession';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Test the connection by counting documents
    const count = await TradingSession.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully!',
      documentsCount: count,
      timestamp: new Date().toISOString(),
    }, { status: 200 });
    
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();
    
    // Create a test trading session
    const testSession = new TradingSession({
      sessionId: `test-${Date.now()}`,
      riskAmount: 350,
      contractType: 'micro',
      inputMode: 'ticks',
      ticks: 15,
      rrRatio: 2,
      tradingRules: {
        followRules: true,
        noFastEntry: true,
        waitConfirmation: true,
        bePlatient: true,
      },
      notes: 'This is a test session from the API',
    });
    
    const savedSession = await testSession.save();
    
    return NextResponse.json({
      success: true,
      message: 'Test trading session created successfully!',
      session: savedSession,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating test session:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create test session',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}