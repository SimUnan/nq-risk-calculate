export interface CalculationResult {
  contracts: number;
  riskAmount: number;
  pointsRisk: number;
  riskPerContract: number;
  totalRisk: number;
  profitTarget: number | null;
  rrRatio: number;
}

export interface TradingRules {
  followRules: boolean;
  noFastEntry: boolean;
  waitConfirmation: boolean;
  bePlatient: boolean;
}

export type ContractType = 'micro' | 'mini';
export type InputMode = 'price' | 'ticks';