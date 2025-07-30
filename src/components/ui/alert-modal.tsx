'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  actionLabel?: string;
}

export function AlertModal({ 
  open, 
  onClose, 
  title, 
  message, 
  type = 'info',
  actionLabel = 'OK'
}: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="transform transition-all duration-500 ease-out">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {getIcon()}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="min-w-20">
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy usage
export function useAlertModal() {
  const [alert, setAlert] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setAlert({ open: true, title, message, type });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const AlertComponent = () => (
    <AlertModal
      open={alert.open}
      onClose={hideAlert}
      title={alert.title}
      message={alert.message}
      type={alert.type}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent
  };
}