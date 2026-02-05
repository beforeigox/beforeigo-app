import { useEffect, useState } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  role: string;
  completedQuestions: number;
  totalQuestions: number;
  imagesAdded: number;
  audioRecordings: number;
  onViewStory: () => void;
}

export function CompletionModal({
  isOpen,
  role,
  completedQuestions,
  totalQuestions,
  imagesAdded,
  audioRecordings,
  onViewStory
}: CompletionModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    } else {
      setShowContent(false);
      setProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
      <div className={`confetti-container ${showContent ? 'active' : ''}`}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#8f1133', '#d4af37', '#f4f1ea', '#e8b4bc'][Math.floor(Math.random() * 4)]
            }}
          />
        ))}
      </div>

      <div className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 paper-texture transition-all duration-500 ${
        showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
            <Sparkles className="w-12 h-12 text-white absolute -top-2 -right-2 animate-pulse" />
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-4xl font-serif font-bold text-warmGray-700 mb-4">
            Congratulations!
          </h2>

          <p className="text-xl text-warmGray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            You've completed all {totalQuestions} questions and preserved<br />
            <span className="text-burgundy-600 font-semibold">{role}'s story</span> for generations to come.
          </p>

          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f4f1ea"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#8f1133"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-burgundy-600">{Math.round(progress)}</div>
                <div className="text-xs text-warmGray-500 font-medium">of {totalQuestions}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cream-100 to-rose-50 rounded-2xl p-6 mb-8 border border-cream-300">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-burgundy-600 mb-1">{completedQuestions}</div>
                <div className="text-sm text-warmGray-600">Questions<br />Answered</div>
              </div>
              <div className="text-center border-x border-cream-300">
                <div className="text-3xl font-bold text-burgundy-600 mb-1">{imagesAdded}</div>
                <div className="text-sm text-warmGray-600">Photos<br />Added</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-burgundy-600 mb-1">{audioRecordings}</div>
                <div className="text-sm text-warmGray-600">Audio<br />Recordings</div>
              </div>
            </div>
          </div>

          <p className="text-base text-warmGray-600 italic mb-8 leading-relaxed">
            "This is a gift that will last forever."
          </p>

          <button
            onClick={onViewStory}
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-burgundy-600 text-white rounded-2xl hover:bg-burgundy-700 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl mx-auto animate-pulse-glow"
          >
            <span>See My Complete Story</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
        }

        .confetti-container.active .confetti {
          animation: confetti-fall 3s linear forwards;
          opacity: 1;
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 20px 25px -5px rgba(143, 17, 51, 0.1), 0 10px 10px -5px rgba(143, 17, 51, 0.04);
          }
          50% {
            box-shadow: 0 20px 25px -5px rgba(143, 17, 51, 0.3), 0 10px 10px -5px rgba(143, 17, 51, 0.2);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
