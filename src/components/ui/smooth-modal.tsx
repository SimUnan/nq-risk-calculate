'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface SmoothModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  actionLabel?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function SmoothModal({ 
  open, 
  onClose, 
  title, 
  message, 
  type = 'info',
  actionLabel = 'OK',
  showCancel = false,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default'
}: SmoothModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                y: -10
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.22, 1, 0.36, 1],
                type: "spring",
                stiffness: 400,
                damping: 30
              }}
              className="relative w-full max-w-md bg-background rounded-lg border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col gap-2 text-center sm:text-left mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
                    >
                      {getIcon()}
                    </motion.div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  {showCancel && (
                    <Button
                      variant="outline"
                      onClick={onClose}
                    >
                      {cancelLabel}
                    </Button>
                  )}
                  <Button
                    onClick={handleConfirm}
                    className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {showCancel ? confirmLabel : actionLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for alerts
export function useSmoothAlert() {
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
    <SmoothModal
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

// Hook for confirmations
export function useSmoothConfirm() {
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
    <SmoothModal
      open={confirm.open}
      onClose={hideConfirm}
      title={confirm.title}
      message={confirm.message}
      showCancel={true}
      onConfirm={confirm.onConfirm}
      confirmLabel={confirm.confirmLabel}
      cancelLabel={confirm.cancelLabel}
      variant={confirm.variant}
      type={confirm.variant === 'destructive' ? 'warning' : 'info'}
    />
  );

  return {
    showConfirm,
    hideConfirm,
    ConfirmComponent
  };
}