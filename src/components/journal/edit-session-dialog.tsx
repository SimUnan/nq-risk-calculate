'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ITradingSession } from "@/models/TradingSession";
import { DollarSign, TrendingUp, TrendingDown, Target, Clock, Minus } from "lucide-react";

interface EditSessionDialogProps {
  session: ITradingSession | null;
  open: boolean;
  onClose: () => void;
  onSave: (sessionId: string, updatedData: Partial<ITradingSession>) => Promise<void>;
  isSaving: boolean;
}

export function EditSessionDialog({ session, open, onClose, onSave, isSaving }: EditSessionDialogProps) {
  const [formData, setFormData] = useState({
    notes: '',
    actualProfit: '',
    tradeStatus: 'pending' as 'win' | 'loss' | 'breakeven' | 'pending',
    exitPrice: '',
  });

  useEffect(() => {
    if (session) {
      setFormData({
        notes: session.notes || '',
        actualProfit: session.actualProfit?.toString() || '',
        tradeStatus: session.tradeStatus || 'pending',
        exitPrice: session.exitPrice?.toString() || '',
      });
    }
  }, [session]);

  const handleSave = async () => {
    if (!session) return;

    console.log('Saving session data:', {
      sessionId: session._id?.toString(),
      formData
    });

    const updatedData: Partial<ITradingSession> = {
      notes: formData.notes,
      tradeStatus: formData.tradeStatus as 'win' | 'loss' | 'breakeven' | 'pending',
    };

    // Calculate actual profit based on trade status and amount
    if (formData.actualProfit && formData.actualProfit !== '') {
      const amount = Math.abs(parseFloat(formData.actualProfit));
      
      if (formData.tradeStatus === 'win') {
        updatedData.actualProfit = amount; // Positive for wins
      } else if (formData.tradeStatus === 'loss') {
        updatedData.actualProfit = -amount; // Negative for losses
      } else if (formData.tradeStatus === 'breakeven') {
        updatedData.actualProfit = 0; // Zero for breakeven
      } else {
        updatedData.actualProfit = amount; // Keep as-is for pending
      }
    }

    // Only include exitPrice if it's provided
    if (formData.exitPrice && formData.exitPrice !== '') {
      updatedData.exitPrice = parseFloat(formData.exitPrice);
    }

    console.log('Sending update data:', updatedData);

    await onSave(session._id?.toString() || '', updatedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!session) return null;


  return (
    <Dialog open={open} onOpenChange={() => !isSaving && onClose()}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trading Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Session Info */}
          <div className="p-4 rounded-lg bg-muted/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contract Type:</span>
              <span className="font-medium">{session.contractType === 'micro' ? 'MNQ' : 'NQ'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk Amount:</span>
              <span className="font-medium">${session.riskAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Calculated Contracts:</span>
              <span className="font-medium">{session.calculatedContracts}</span>
            </div>
            {session.profitTarget && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profit Target:</span>
                <span className="font-medium text-green-600">${session.profitTarget.toFixed(2)}</span>
              </div>
            )}
          </div>


          {/* Trade Outcome */}
          <div className="space-y-2">
            <Label htmlFor="trade-status">Trade Status</Label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-muted rounded-lg">
              {[
                { value: 'pending', label: 'Pending', Icon: Clock, color: 'text-muted-foreground' },
                { value: 'win', label: 'Win', Icon: TrendingUp, color: 'text-green-600' },
                { value: 'loss', label: 'Loss', Icon: TrendingDown, color: 'text-red-600' },
                { value: 'breakeven', label: 'Breakeven', Icon: Minus, color: 'text-yellow-600' }
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleInputChange('tradeStatus', status.value)}
                  className={`relative flex flex-col items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                    formData.tradeStatus === status.value
                      ? `bg-background shadow-sm ${status.color} ring-1 ring-border`
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <status.Icon className="h-4 w-4 mb-1" />
                  <span>{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actual Profit/Loss Amount */}
          <div className="space-y-2">
            <Label htmlFor="actual-profit" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Trade Amount ($)
            </Label>
            <Input
              id="actual-profit"
              type="number"
              step="0.01"
              min="0"
              value={formData.actualProfit ? Math.abs(parseFloat(formData.actualProfit)).toString() : ''}
              onChange={(e) => handleInputChange('actualProfit', e.target.value)}
              placeholder="Enter trade amount (e.g., 500)"
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              {formData.tradeStatus === 'win' && '✅ This will be saved as +$' + (formData.actualProfit ? Math.abs(parseFloat(formData.actualProfit)).toString() : '0')}
              {formData.tradeStatus === 'loss' && '❌ This will be saved as -$' + (formData.actualProfit ? Math.abs(parseFloat(formData.actualProfit)).toString() : '0')}
              {formData.tradeStatus === 'breakeven' && '⚖️ This will be saved as $0'}
              {formData.tradeStatus === 'pending' && 'ℹ️ Enter the dollar amount (sign will be applied automatically)'}
            </p>
          </div>

          {/* Exit Price */}
          <div className="space-y-2">
            <Label htmlFor="exit-price" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Exit Price (Optional)
            </Label>
            <Input
              id="exit-price"
              type="number"
              step="0.25"
              value={formData.exitPrice}
              onChange={(e) => handleInputChange('exitPrice', e.target.value)}
              placeholder="Enter exit price"
              className="text-lg"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this trade..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}