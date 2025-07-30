"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { PositionCalculator } from "@/components/calculator/position-calculator";
import { PositionResults } from "@/components/calculator/position-results";
import { TradingRules } from "@/components/calculator/trading-rules";
import { TradeNotes } from "@/components/calculator/trade-notes";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { usePositionCalculator } from "@/hooks/use-position-calculator";
import { Button } from "@/components/ui/button";
import { TrendingUp, Book } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const {
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
    calculatePositionSize,
    handleRuleChange,
    saveSession,
    setShowSuccessDialog,
  } = usePositionCalculator();

  const result = calculatePositionSize();

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch(`/api/test-connection`);
      const data = await response.json();
      console.log(data);
    }
    fetchSessions();
  },[])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                NQ Position Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate optimal position sizes for futures trading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/journal">
              <Button variant="outline" className="gap-2">
                <Book className="h-4 w-4" />
                Trading Journal
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PositionCalculator
              riskAmount={riskAmount}
              setRiskAmount={setRiskAmount}
              entryPrice={entryPrice}
              setEntryPrice={setEntryPrice}
              stopPrice={stopPrice}
              setStopPrice={setStopPrice}
              ticks={ticks}
              setTicks={setTicks}
              rrRatio={rrRatio}
              setRrRatio={setRrRatio}
              contractType={contractType}
              setContractType={setContractType}
              inputMode={inputMode}
              setInputMode={setInputMode}
            />

            {result && (
              <PositionResults
                result={result}
                contractType={contractType}
                onSave={saveSession}
                isSaving={isSaving}
              />
            )}
          </div>

          <div className="space-y-6">
            <TradingRules rules={rules} onRuleChange={handleRuleChange} />
            <TradeNotes notes={notes} setNotes={setNotes} />
          </div>
        </div>

        <SuccessDialog
          open={showSuccessDialog}
          onClose={() => setShowSuccessDialog(false)}
          title="Session Saved Successfully! 🎉"
          description="Your trading session has been saved to the database."
        />
      </div>
    </div>
  );
}
