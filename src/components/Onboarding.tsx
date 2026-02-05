import { StorytellerRole } from '../types';
import { BookHeart } from 'lucide-react';

interface OnboardingProps {
  onComplete: (storyteller: StorytellerRole) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const storytellerOptions: { value: StorytellerRole; label: string }[] = [
    { value: 'mom', label: 'Mom' },
    { value: 'dad', label: 'Dad' },
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' },
    { value: 'grandma', label: 'Grandma' },
    { value: 'grandpa', label: 'Grandpa' },
    { value: 'aunt_uncle', label: 'Aunt/Uncle' },
    { value: 'sibling', label: 'Sibling' }
  ];

  const handleStorytellerSelect = (role: StorytellerRole) => {
    onComplete(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B1538] rounded-2xl mb-6">
            <BookHeart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Your Life Story
          </h1>
          <p className="text-lg text-gray-600">
            Let's begin capturing your unique story
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">You are a...</h2>
          <div className="space-y-3">
            {storytellerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStorytellerSelect(option.value)}
                className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-[#8B1538] hover:bg-rose-50 transition-all duration-200 font-medium text-gray-700 hover:text-[#8B1538]"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
