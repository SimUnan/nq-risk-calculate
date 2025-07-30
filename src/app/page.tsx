'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { TrendingUp, DollarSign, Calculator, Target, Hash } from "lucide-react";

export default function Home() {
  const [riskAmount, setRiskAmount] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [ticks, setTicks] = useState('');
  const [contractType, setContractType] = useState('micro');
  const [inputMode, setInputMode] = useState<'price' | 'ticks'>('price');

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

    return {
      contracts,
      riskAmount: risk,
      pointsRisk,
      riskPerContract,
      totalRisk: contracts * riskPerContract
    };
  };

  const result = calculatePositionSize();

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

        <div className="max-w-2xl mx-auto grid gap-6">
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
                <Label htmlFor="risk-amount" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Risk Amount ($)
                </Label>
                <Input
                  id="risk-amount"
                  type="number"
                  value={riskAmount}
                  onChange={(e) => setRiskAmount(e.target.value)}
                  placeholder="e.g., 300"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract-type">Contract Type</Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">Micro NQ (MNQ) - $2/point</SelectItem>
                    <SelectItem value="mini">Mini NQ (NQ) - $20/point</SelectItem>
                  </SelectContent>
                </Select>
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
                      <span className="text-lg font-semibold">${result.totalRisk.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
