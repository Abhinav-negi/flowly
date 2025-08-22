// Save this as: components/ui/alert.tsx

import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  className?: string;
  onClose?: () => void;
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ children, variant = 'default', className = '', onClose, ...props }, ref) => {
    const variantStyles = {
      default: 'border-blue-200 bg-blue-50 text-blue-800',
      destructive: 'border-red-200 bg-red-50 text-red-800',
      success: 'border-green-200 bg-green-50 text-green-800',
    };

    const iconMap = {
      default: Info,
      destructive: AlertCircle,
      success: CheckCircle,
    };

    const Icon = iconMap[variant];

    return (
      <div
        ref={ref}
        className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{children}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

AlertDescription.displayName = 'AlertDescription';

// Usage example:
// <Alert variant="destructive" onClose={() => setShowAlert(false)}>
//   <AlertDescription>Something went wrong!</AlertDescription>
// </Alert>