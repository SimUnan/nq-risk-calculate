import mongoose, { Document, Schema } from 'mongoose';

export interface ITradingSession extends Document {
  sessionId: string;
  riskAmount: number;
  contractType: 'micro' | 'mini';
  inputMode: 'price' | 'ticks';
  entryPrice?: number;
  stopPrice?: number;
  ticks?: number;
  rrRatio?: number;
  calculatedContracts?: number;
  actualRisk?: number;
  profitTarget?: number;
  actualProfit?: number; // New: actual profit/loss from the trade
  tradeStatus?: 'win' | 'loss' | 'breakeven' | 'pending'; // New: trade outcome
  exitPrice?: number; // New: actual exit price
  actualContracts?: number; // New: actual contracts traded
  actualStopLossTicks?: number; // New: actual stop loss in ticks
  tradingRules: {
    followRules: boolean;
    noFastEntry: boolean;
    waitConfirmation: boolean;
    bePlatient: boolean;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const TradingSessionSchema = new Schema<ITradingSession>({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  riskAmount: {
    type: Number,
    required: true,
  },
  contractType: {
    type: String,
    enum: ['micro', 'mini'],
    required: true,
  },
  inputMode: {
    type: String,
    enum: ['price', 'ticks'],
    required: true,
  },
  entryPrice: Number,
  stopPrice: Number,
  ticks: Number,
  rrRatio: Number,
  calculatedContracts: Number,
  actualRisk: Number,
  profitTarget: Number,
  actualProfit: Number,
  tradeStatus: {
    type: String,
    enum: ['win', 'loss', 'breakeven', 'pending'],
    default: 'pending',
  },
  exitPrice: Number,
  actualContracts: Number,
  actualStopLossTicks: Number,
  tradingRules: {
    followRules: { type: Boolean, default: false },
    noFastEntry: { type: Boolean, default: false },
    waitConfirmation: { type: Boolean, default: false },
    bePlatient: { type: Boolean, default: false },
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Prevent re-compilation during development
export default mongoose.models.TradingSession || mongoose.model<ITradingSession>('TradingSession', TradingSessionSchema);