'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Calculator, Target, Hash } from "lucide-react";
import { ContractType, InputMode } from "@/types/calculator";

interface PositionCalculatorProps {
  riskAmount: string;
  setRiskAmount: (value: string) => void;
  entryPrice: string;
  setEntryPrice: (value: string) => void;
  stopPrice: string;
  setStopPrice: (value: string) => void;
  ticks: string;
  setTicks: (value: string) => void;
  rrRatio: string;
  setRrRatio: (value: string) => void;
  contractType: ContractType;
  setContractType: (type: ContractType) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
}

export function PositionCalculator({
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
}: PositionCalculatorProps) {
  return (
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
            className="text-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}