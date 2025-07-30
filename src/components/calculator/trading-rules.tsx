'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckSquare } from "lucide-react";
import { TradingRules as TradingRulesType } from "@/types/calculator";

interface TradingRulesProps {
  rules: TradingRulesType;
  onRuleChange: (rule: keyof TradingRulesType, checked: boolean) => void;
}

export function TradingRules({ rules, onRuleChange }: TradingRulesProps) {
  return (
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
            onCheckedChange={(checked) => onRuleChange('followRules', checked as boolean)}
          />
          <Label htmlFor="follow-rules" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Follow your rules
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="no-fast-entry"
            checked={rules.noFastEntry}
            onCheckedChange={(checked) => onRuleChange('noFastEntry', checked as boolean)}
          />
          <Label htmlFor="no-fast-entry" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            No fast entry
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="wait-confirmation"
            checked={rules.waitConfirmation}
            onCheckedChange={(checked) => onRuleChange('waitConfirmation', checked as boolean)}
          />
          <Label htmlFor="wait-confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Wait for confirmation to form
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="be-patient"
            checked={rules.bePlatient}
            onCheckedChange={(checked) => onRuleChange('bePlatient', checked as boolean)}
          />
          <Label htmlFor="be-patient" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Be patient
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}