'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm,
  title, 
  message, 
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default'
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {variant === 'destructive' && (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy usage
export function useConfirmModal() {
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel: string;
    cancelLabel: string;
    variant: 'default' | 'destructive';
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'default'
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmLabel?: string;
      cancelLabel?: string;
      variant?: 'default' | 'destructive';
    }
  ) => {
    setConfirm({
      open: true,
      title,
      message,
      onConfirm,
      confirmLabel: options?.confirmLabel || 'Confirm',
      cancelLabel: options?.cancelLabel || 'Cancel',
      variant: options?.variant || 'default'
    });
  };

  const hideConfirm = () => {
    setConfirm(prev => ({ ...prev, open: false }));
  };

  const ConfirmComponent = () => (
    <ConfirmModal
      open={confirm.open}
      onClose={hideConfirm}
      onConfirm={confirm.onConfirm}
      title={confirm.title}
      message={confirm.message}
      confirmLabel={confirm.confirmLabel}
      cancelLabel={confirm.cancelLabel}
      variant={confirm.variant}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmComponent
  };
}