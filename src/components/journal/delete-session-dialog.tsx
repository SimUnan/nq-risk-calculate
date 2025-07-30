'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ITradingSession } from "@/models/TradingSession";
import { formatDateShort } from "@/utils/date-helpers";

interface DeleteSessionDialogProps {
  session: ITradingSession | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteSessionDialog({
  session,
  open,
  onClose,
  onConfirm,
  isDeleting
}: DeleteSessionDialogProps) {
  if (!session) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            🗑️ Delete Trading Session
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete this trading session? This action cannot be undone.
            </p>
            
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {formatDateShort(new Date(session.createdAt))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk:</span>
                <span className="font-medium">${session.riskAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contracts:</span>
                <span className="font-medium text-primary">
                  {session.calculatedContracts}
                </span>
              </div>
              {session.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-xs">Notes:</span>
                  <p className="text-sm mt-1 truncate">{session.notes}</p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Session'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}