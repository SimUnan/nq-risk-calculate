'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/mode-toggle";
import { TrendingUp, DollarSign, Calculator, Target, Hash, CheckSquare, FileText } from "lucide-react";

export default function Home() {
  const [riskAmount, setRiskAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [ticks, setTicks] = useState('');
  const [rrRatio, setRrRatio] = useState('');
  const [contractType, setContractType] = useState('micro');
  const [inputMode, setInputMode] = useState<'price' | 'ticks'>('ticks');
  
  // Trading rules checklist
  const [rules, setRules] = useState({
    followRules: false,
    noFastEntry: false,
    waitConfirmation: false,
    bePlatient: false,
  });
  
  // Notes
  const [notes, setNotes] = useState('');

  const calculatePositionSize = () => {
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

  const result = calculatePositionSize();

  const handleRuleChange = (rule: keyof typeof rules, checked: boolean) => {
    setRules(prev => ({ ...prev, [rule]: checked }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">NQ Position Calculator</h1>
              <p className="text-muted-foreground">Calculate optimal position sizes for futures trading</p>
            </div>
          </div>
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Trading Parameters
              </CardTitle>
              <CardDescription>
                Enter your risk amount and trade setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="risk-amount" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Risk Amount ($)
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRiskAmount('350')}
                    className="text-xs px-3 py-1"
                  >
                    $350
                  </Button>
                </div>
                <Input
                  id="risk-amount"
                  type="number"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(e.target.value)}
                  placeholder="e.g., 300"
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Contract Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={contractType === 'micro' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContractType('micro')}
                      className="gap-2"
                    >
                      MNQ - $2/point
                    </Button>
                    <Button
                      variant={contractType === 'mini' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setContractType('mini')}
                      className="gap-2"
                    >
                      NQ - $20/point
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Risk Input Method</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={inputMode === 'price' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInputMode('price')}
                      className="gap-2"
                    >
                      <Target className="h-4 w-4" />
                      Price Range
                    </Button>
                    <Button
                      variant={inputMode === 'ticks' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setInputMode('ticks')}
                      className="gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      Ticks
                    </Button>
                  </div>
                </div>

                {inputMode === 'price' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry-price" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Entry Price
                      </Label>
                      <Input
                        id="entry-price"
                        type="number"
                        step="0.25"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        placeholder="e.g., 18500.00"
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stop-price">Stop Loss Price</Label>
                      <Input
                        id="stop-price"
                        type="number"
                        step="0.25"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(e.target.value)}
                        placeholder="e.g., 18450.00"
                        className="text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="ticks" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Number of Ticks
                    </Label>
                    <Input
                      id="ticks"
                      type="number"
                      value={ticks}
                      onChange={(e) => setTicks(e.target.value)}
                      placeholder="e.g., 15"
                      className="text-lg"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rr-ratio">Risk:Reward Ratio (optional)</Label>
                <Input
                  id="rr-ratio"
                  type="number"
                  step="0.1"
                  value={rrRatio}
                  onChange={(e) => setRrRatio(e.target.value)}
                  placeholder="e.g., 2 (for 1:2 RR)"
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Position Size Results</CardTitle>
                <CardDescription>
                  Based on your risk parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Risk Amount</span>
                      <span className="text-lg font-semibold">${result.riskAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Points at Risk</span>
                      <span className="text-lg font-semibold">{result.pointsRisk.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Risk per Contract</span>
                      <span className="text-lg font-semibold">${result.riskPerContract.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                      <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Contracts to Trade</p>
                        <p className="text-4xl font-bold text-primary mb-2">{result.contracts}</p>
                        <p className="text-sm text-muted-foreground">
                          {contractType === 'micro' ? 'Micro NQ (MNQ)' : 'Mini NQ (NQ)'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Actual Risk</span>
                      <span className="text-lg font-semibold text-red-500">${result.totalRisk.toFixed(2)}</span>
                    </div>
                    
                    {result.profitTarget && (
                      <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="text-sm font-medium text-muted-foreground">Profit Target ({result.rrRatio}:1 RR)</span>
                        <span className="text-lg font-semibold text-green-500">${result.profitTarget.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          </div>

          {/* Right sidebar with rules and notes */}
          <div className="space-y-6">
            {/* Trading Rules Card */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Trading Rules
                </CardTitle>
                <CardDescription>
                  Check off your rules before trading
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="follow-rules"
                    checked={rules.followRules}
                    onCheckedChange={(checked) => handleRuleChange('followRules', checked as boolean)}
                  />
                  <Label htmlFor="follow-rules" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Follow your rules
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="no-fast-entry"
                    checked={rules.noFastEntry}
                    onCheckedChange={(checked) => handleRuleChange('noFastEntry', checked as boolean)}
                  />
                  <Label htmlFor="no-fast-entry" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    No fast entry
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wait-confirmation"
                    checked={rules.waitConfirmation}
                    onCheckedChange={(checked) => handleRuleChange('waitConfirmation', checked as boolean)}
                  />
                  <Label htmlFor="wait-confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Wait for confirmation to form
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="be-patient"
                    checked={rules.bePlatient}
                    onCheckedChange={(checked) => handleRuleChange('bePlatient', checked as boolean)}
                  />
                  <Label htmlFor="be-patient" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Be patient
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Notes Card */}
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Trade Notes
                </CardTitle>
                <CardDescription>
                  Document your trade setup and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., 1. Pattern formed at support&#10;2. Volume confirmation&#10;3. RSI oversold..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
