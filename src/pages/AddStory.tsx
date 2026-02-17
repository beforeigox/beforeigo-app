import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, ChefHat, Check } from 'lucide-react';

const RECIPE_STRIPE_LINK = 'https://buy.stripe.com/your-recipe-link';

export function AddStory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-3" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Grow Your Legacy
          </h1>
          <p className="text-lg" style={{ color: '#6B5B73' }}>
            Choose how you'd like to expand your story
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate('/checkout')}
            className="bg-white rounded-2xl p-8 cursor-pointer group transition-all border border-gray-100"
            style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(143, 17, 51, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.1)'}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
              <BookOpen className="h-7 w-7" style={{ color: '#8f1133' }} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
              Start a New Story
            </h2>
            <p className="text-sm mb-6" style={{ color: '#6B5B73' }}>
              Choose from one of our great tiers and preserve another beautiful chapter of your life.
            </p>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
              style={{ backgroundColor: '#8f1133', color: 'white' }}
            >
              <span>View Plans</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
          <div
            onClick={() => window.location.href = RECIPE_STRIPE_LINK}
            className="bg-white rounded-2xl p-8 cursor-pointer group transition-all border border-gray-100"
            style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(143, 17, 51, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.1)'}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
              <ChefHat className="h-7 w-7" style={{ color: '#8f1133' }} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
              Preserve Your Recipes Forever
            </h2>
            <p className="text-sm mb-4" style={{ color: '#6B5B73' }}>
              Turn your family's most treasured recipes into a beautiful keepsake cookbook.
            </p>
            <ul className="space-y-2 mb-6">
              {['Save up to 50 family recipes', 'Add photos to each recipe', 'Beautiful printable format', 'Preserve for generations'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{ color: '#6B5B73' }}>
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: '#8f1133' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm"
              style={{ backgroundColor: '#8f1133', color: 'white' }}
            >
              <span>Get Recipe Book – $8</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button onClick={() => window.history.back()} className="text-sm hover:underline" style={{ color: '#6B5B73' }}>
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}
