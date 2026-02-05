import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface ProgressToastProps {
  isVisible: boolean;
  milestone: number;
  message: string;
  onClose: () => void;
}

export function ProgressToast({ isVisible, milestone, message, onClose }: ProgressToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-burgundy-600 p-6 max-w-md paper-texture">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-burgundy-600 uppercase tracking-wider">
                {milestone}% Complete
              </span>
            </div>
            <p className="text-warmGray-700 font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
