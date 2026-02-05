import { X, Mic, Video, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';
import { useState } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'audio' | 'video';
  currentPlan: 'storyteller' | 'keepsake' | 'legacy';
  storyId: string;
  onPlanUpdated: () => void;
}

export function UpgradeModal({ isOpen, onClose, feature, currentPlan, storyId, onPlanUpdated }: UpgradeModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isOpen) return null;

  const calculateUpgradePricing = () => {
    const UPGRADE_FEE = 5;

    if (currentPlan === 'storyteller') {
      return {
        keepsake: 9 + UPGRADE_FEE,
        legacy: 18 + UPGRADE_FEE
      };
    } else if (currentPlan === 'keepsake') {
      return {
        keepsake: 0,
        legacy: 9 + UPGRADE_FEE
      };
    }
    return { keepsake: 0, legacy: 0 };
  };

  const pricing = calculateUpgradePricing();

  const handleDemoUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await supabase
        .from('stories')
        .update({ plan: 'legacy' })
        .eq('id', storyId);

      onPlanUpdated();
      onClose();
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-warmGray-500 hover:text-warmGray-700 hover:bg-cream-100 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-2xl mb-6 mx-auto">
          {feature === 'audio' ? (
            <Mic className="w-8 h-8 text-white" />
          ) : (
            <Video className="w-8 h-8 text-white" />
          )}
        </div>

        <h2 className="text-3xl font-serif font-bold text-warmGray-800 text-center mb-3">
          Unlock {feature === 'audio' ? 'Audio' : 'Video'} Recording
        </h2>

        <div className="flex items-center justify-center gap-2 text-burgundy-600 mb-6">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Premium Feature</span>
        </div>

        <p className="text-lg text-warmGray-600 text-center mb-8 leading-relaxed">
          Preserve your {feature === 'audio' ? 'voice' : 'voice and face'} for future generations.
          Upgrade to <span className="font-semibold text-warmGray-800">Keepsake</span> or{' '}
          <span className="font-semibold text-warmGray-800">Legacy</span> to save{' '}
          {feature === 'audio' ? 'audio' : 'video'} recordings with your stories.
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 text-warmGray-700">
            <div className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-burgundy-600 rounded-full" />
            </div>
            <span>Unlimited audio and video recordings</span>
          </div>
          <div className="flex items-start gap-3 text-warmGray-700">
            <div className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-burgundy-600 rounded-full" />
            </div>
            <span>Capture authentic emotions and expressions</span>
          </div>
          <div className="flex items-start gap-3 text-warmGray-700">
            <div className="w-6 h-6 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-burgundy-600 rounded-full" />
            </div>
            <span>Create a lasting multimedia legacy</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              window.location.href = '#pricing';
            }}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-xl hover:from-burgundy-700 hover:to-burgundy-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Upgrade Now
          </button>
        </div>

        {currentPlan === 'storyteller' && (
          <p className="text-sm text-warmGray-500 text-center mt-6">
            Keepsake: ${pricing.keepsake} upgrade • Legacy: ${pricing.legacy} upgrade
          </p>
        )}
        {currentPlan === 'keepsake' && (
          <p className="text-sm text-warmGray-500 text-center mt-6">
            Legacy: ${pricing.legacy} upgrade
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-cream-200">
          <button
            onClick={handleDemoUpgrade}
            disabled={isUpgrading}
            className="w-full px-4 py-2 text-sm text-burgundy-600 hover:bg-burgundy-50 rounded-lg transition-all font-medium disabled:opacity-50"
          >
            {isUpgrading ? 'Upgrading...' : 'Demo: Unlock All Features (Testing Only)'}
          </button>
        </div>
      </div>
    </div>
  );
}
