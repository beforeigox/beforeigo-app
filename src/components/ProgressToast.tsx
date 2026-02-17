import { useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ProgressToastProps {
  isVisible: boolean;
  milestone: number;
  message: string;
  onClose: () => void;
}

export function ProgressToast({ isVisible, milestone, message, onClose }: ProgressToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border-2 p-6 max-w-md paper-texture" style={{ borderColor: '#8f1133' }}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#8f1133' }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#8f1133' }}>
                {milestone}% Complete!
              </span>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="font-medium leading-relaxed" style={{ color: '#3A3A3A' }}>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}