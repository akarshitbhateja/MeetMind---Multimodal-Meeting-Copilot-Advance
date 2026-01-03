// client/src/components/SuccessModal.tsx
"use client";

import { CheckCircle, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl p-8 w-full max-w-md relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-secondary-text hover:text-foreground">
          <X size={24} />
        </button>
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Success!</h2>
        <p className="text-secondary-text mb-8">
          Your meeting is being scheduled. The Google Meet link will appear on your dashboard momentarily.
        </p>
        
        <div className="flex justify-center">
            <button 
                onClick={onClose} 
                className="px-8 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90"
            >
                Go to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
}