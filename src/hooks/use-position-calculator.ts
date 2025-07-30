import { useState } from 'react';
import { CalculationResult, TradingRules, ContractType, InputMode } from '@/types/calculator';

export function usePositionCalculator() {
  const [riskAmount, setRiskAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [ticks, setTicks] = useState('');
  const [rrRatio, setRrRatio] = useState('');
  const [contractType, setContractType] = useState<ContractType>('micro');
  const [inputMode, setInputMode] = useState<InputMode>('ticks');
  
  // Trading rules checklist
  const [rules, setRules] = useState<TradingRules>({
    followRules: false,
    noFastEntry: false,
    waitConfirmation: false,
    bePlatient: false,
  });
  
  // Notes
  const [notes, setNotes] = useState('');
  
  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const calculatePositionSize = (): CalculationResult | null => {
    const risk = parseFloat(riskAmount);

    if (!risk) return null;

    let pointsRisk: number;

    if (inputMode === 'ticks') {
      const ticksValue = parseFloat(ticks);
      if (!ticksValue) return null;
      pointsRisk = ticksValue;
    } else {
      const entry = parseFloat(entryPrice);
      const stop = parseFloat(stopPrice);
      if (!entry || !stop) return null;
      pointsRisk = Math.abs(entry - stop);
    }
    
    const dollarsPerPoint = contractType === 'micro' ? 2 : 20;
    
    const riskPerContract = pointsRisk * dollarsPerPoint;
    const contracts = Math.floor(risk / riskPerContract);

    const rr = parseFloat(rrRatio);
    const profitTarget = rr ? contracts * riskPerContract * rr : null;

    return {
      contracts,
      riskAmount: risk,
      pointsRisk,
      riskPerContract,
      totalRisk: contracts * riskPerContract,
      profitTarget,
      rrRatio: rr
    };
  };

  const handleRuleChange = (rule: keyof TradingRules, checked: boolean) => {
    setRules(prev => ({ ...prev, [rule]: checked }));
  };

  const saveSession = async () => {
    const result = calculatePositionSize();
    if (!result) {
      return false;
    }

    setIsSaving(true);
    
    try {
      const sessionData = {
        riskAmount: result.riskAmount,
        contractType,
        inputMode,
        entryPrice: inputMode === 'price' ? parseFloat(entryPrice) : undefined,
        stopPrice: inputMode === 'price' ? parseFloat(stopPrice) : undefined,
        ticks: inputMode === 'ticks' ? parseFloat(ticks) : undefined,
        rrRatio: result.rrRatio || undefined,
        calculatedContracts: result.contracts,
        actualRisk: result.totalRisk,
        profitTarget: result.profitTarget,
        // New fields for actual trade results (default to pending until user updates)
        actualProfit: undefined, // Will be set when user edits the session
        tradeStatus: 'pending' as const,
        exitPrice: undefined,
        tradingRules: rules,
        notes,
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessDialog(true);
        return true;
      } else {
        throw new Error(data.message || 'Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    riskAmount,
    setRiskAmount,
    entryPrice,
    setEntryPrice,
    stopPrice,
    setStopPrice,
    ticks,
    setTicks,
    rrRatio,
    setRrRatio,
    contractType,
    setContractType,
    inputMode,
    setInputMode,
    rules,
    notes,
    setNotes,
    isSaving,
    showSuccessDialog,
    
    // Functions
    calculatePositionSize,
    handleRuleChange,
    saveSession,
    setShowSuccessDialog,
  };
}