import { useState } from 'react';
import { ChefHat, X, Sparkles, Check, ArrowRight, Zap } from 'lucide-react';

interface RecipeUpsellModalProps {
  isOpen: boolean;
  selectedTier: 'storyteller' | 'keepsake' | 'legacy';
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

const tierPrices = {
  storyteller: { base: 26, withRecipe: 34 },
  keepsake: { base: 35, withRecipe: 43 },
  legacy: { base: 44, withRecipe: 44 }, // Legacy already includes it
};

const tierNames = {
  storyteller: 'The Storyteller',
  keepsake: 'The Keepsake',
  legacy: 'The Legacy',
};

export function RecipeUpsellModal({ isOpen, selectedTier, onClose, onAccept, onDecline }: RecipeUpsellModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const prices = tierPrices[selectedTier];
  const savings = 8; // Recipe book standalone price
  const addOnPrice = prices.withRecipe - prices.base;

  const handleAccept = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onAccept();
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      
      {/* Modal */}
      <div
        className="relative max-w-md w-full rounded-3xl overflow-hidden"
        style={{ boxShadow: '0 25px 50px -12px rgba(143, 17, 51, 0.4)' }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-3xl z-0"
          style={{
            background: 'linear-gradient(135deg, #8f1133, #FAF7F2, #8f1133, #FAF7F2)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 3s ease infinite',
            padding: '2px',
          }}
        ></div>

        <div className="relative z-10 bg-white rounded-3xl overflow-hidden">
          
          {/* Top Banner */}
          <div className="relative px-8 pt-8 pb-6 text-center" style={{ backgroundColor: '#8f1133' }}>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Flash icon */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
              <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">One-Time Offer</span>
              <Zap className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            </div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <ChefHat className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-serif font-bold text-white mb-1" style={{ fontFamily: 'Crimson Text, serif' }}>
              Add Your Recipe Book!
            </h2>
            <p className="text-white opacity-80 text-sm">
              Preserve your family's most treasured recipes forever
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Price display */}
            <div className="flex items-center justify-center gap-4 mb-6 p-4 rounded-2xl" style={{ backgroundColor: '#FEF2F4' }}>
              <div className="text-center">
                <div className="text-sm font-medium mb-1" style={{ color: '#6B5B73' }}>{tierNames[selectedTier]}</div>
                <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>${prices.base}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#8f1133' }}>+</div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1" style={{ color: '#6B5B73' }}>Recipe Book</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>${addOnPrice}</div>
                  <div className="text-sm line-through" style={{ color: '#9CA3AF' }}>$8</div>
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#8f1133' }}>=</div>
              <div className="text-center">
                <div className="text-sm font-medium mb-1" style={{ color: '#6B5B73' }}>Total</div>
                <div className="text-2xl font-bold" style={{ color: '#8f1133' }}>${prices.withRecipe}</div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {[
                'Save unlimited family recipes',
                'Add photos to each recipe',
                'Organize by category (Breakfast, Dinner, Desserts...)',
                'Beautiful printable format',
                'Preserve for generations',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#3A3A3A' }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5E6EA' }}>
                    <Check className="h-3 w-3" style={{ color: '#8f1133' }} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* Sparkle badge */}
            <div className="flex items-center justify-center gap-2 mb-6 py-2 px-4 rounded-full text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Only available at checkout - never shown again!</span>
            </div>

            {/* Buttons */}
            <button
              onClick={handleAccept}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all mb-3 ${isAnimating ? 'scale-95' : 'hover:scale-105'}`}
              style={{ backgroundColor: '#8f1133', boxShadow: '0 4px 15px rgba(143, 17, 51, 0.4)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              <ChefHat className="h-5 w-5" />
              <span>YES! Add Recipe Book for ${addOnPrice}</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={onDecline}
              className="w-full py-3 text-sm transition-colors"
              style={{ color: '#9CA3AF' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6B5B73'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              No thanks, just {tierNames[selectedTier]} for ${prices.base}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
