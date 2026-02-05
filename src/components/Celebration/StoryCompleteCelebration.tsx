import React, { useState, useEffect } from 'react';
import {
  Heart,
  BookOpen,
  Share2,
  Plus,
  Award,
  Calendar,
  Camera,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoryCompleteCelebrationProps {
  storyId: string;
  storyTitle: string;
  role: string;
  completionDate: string;
  totalQuestions: number;
  photoCount?: number;
  hasRecipeStories?: boolean;
  onStartNewStory: (role: string) => void;
  onOrderBook: () => void;
}

export function StoryCompleteCelebration({
  storyId,
  storyTitle,
  role,
  completionDate,
  totalQuestions,
  photoCount = 0,
  hasRecipeStories = false,
  onStartNewStory,
  onOrderBook
}: StoryCompleteCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewStory = () => {
    alert('📖 Opening your complete story...\n\nThis would show a beautiful reading interface with:\n• Chapter navigation\n• All your responses formatted beautifully\n• Photos and memories inline\n• Print-friendly layout');
  };

  const handleShareWithFamily = () => {
    navigate('/export');
  };

  const handleStartAnotherStory = () => {
    alert('🌟 Start a new story!\n\nChoose who\'s story you\'d like to capture next:\n• Dad\n• Grandma\n• Grandpa\n• Mom\n• Another loved one');
  };

  const handleRecipeStoriesUpsell = () => {
    alert('👨‍🍳 Recipe Stories Add-On - $8\n\nCapture your family\'s treasured recipes with the stories behind them:\n• Grandma\'s secret cookie recipe\n• Dad\'s famous BBQ sauce\n• Holiday traditions\n• Kitchen memories\n\nThis would redirect to Stripe checkout.');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <Heart className="h-4 w-4" style={{ color: '#8f1133' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#8f1133' }}>
            <Award className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-5xl font-serif font-bold mb-4" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Your Story is Complete!
          </h1>

          <p className="text-2xl mb-6" style={{ color: '#6B5B73' }}>
            You've preserved {totalQuestions} precious memories. This is a gift that will last forever.
          </p>

          {/* Stats Badge */}
          <div className="inline-flex items-center space-x-4 bg-white px-6 py-3 rounded-full shadow-md" style={{ border: '2px solid #8f1133' }}>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" style={{ color: '#8f1133' }} />
              <span className="font-semibold" style={{ color: '#3A3A3A' }}>{totalQuestions}/{totalQuestions} questions</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5" style={{ color: '#8f1133' }} />
              <span className="font-semibold" style={{ color: '#3A3A3A' }}>{photoCount} photos</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" style={{ color: '#8f1133' }} />
              <span className="font-semibold" style={{ color: '#3A3A3A' }}>Completed {new Date(completionDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* View Your Story */}
          <div
            className="bg-white rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1"
            style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}
            onClick={handleViewStory}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <BookOpen className="h-8 w-8" style={{ color: '#8f1133' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>View Your Story</h3>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Read Your Complete Story</p>
              </div>
            </div>
            <button
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              View Story
            </button>
          </div>

          {/* Share with Family */}
          <div
            className="bg-white rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1"
            style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}
            onClick={handleShareWithFamily}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <Share2 className="h-8 w-8" style={{ color: '#8f1133' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Share with Family</h3>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Send to family or generate a link</p>
              </div>
            </div>
            <button
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              Share Now
            </button>
          </div>

          {/* Order Physical Book */}
          <div
            className="bg-white rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1"
            style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}
            onClick={onOrderBook}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <ShoppingBag className="h-8 w-8" style={{ color: '#8f1133' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Order Physical Book</h3>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Premium hardcover • $79</p>
              </div>
            </div>
            <button
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              Order Book
            </button>
          </div>

          {/* Start Another Story */}
          <div
            className="bg-white rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1"
            style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}
            onClick={handleStartAnotherStory}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <Plus className="h-8 w-8" style={{ color: '#8f1133' }} />
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Start Another Story</h3>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Keep the legacy growing</p>
              </div>
            </div>
            <button
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              Start New Story
            </button>
          </div>

          {/* Recipe Stories Add-On (Conditional) */}
          {!hasRecipeStories && (
            <div
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1 md:col-span-2 border-2 border-amber-200"
              style={{ boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.2)' }}
              onClick={handleRecipeStoriesUpsell}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl" style={{ backgroundColor: '#FEF3C7' }}>
                  <Sparkles className="h-8 w-8" style={{ color: '#D97706' }} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Recipe Stories Add-On</h3>
                  <p className="text-sm" style={{ color: '#92400E' }}>Add family recipes with stories • $8</p>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-700"
              >
                Add Recipe Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}