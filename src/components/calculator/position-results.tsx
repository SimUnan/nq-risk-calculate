import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalculationResult } from "@/types/calculator";
import { Save } from "lucide-react";

interface PositionResultsProps {
  result: CalculationResult;
  contractType: 'micro' | 'mini';
  onSave?: () => void;
  isSaving?: boolean;
}

export function PositionResults({ result, contractType, onSave, isSaving }: PositionResultsProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 backdrop-blur">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Position Size Results</CardTitle>
            <CardDescription>
              Based on your risk parameters
            </CardDescription>
          </div>
          {onSave && (
            <Button 
              onClick={onSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Session'}
            </Button>
          )}
        </div>
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
  );
}