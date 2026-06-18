import { ChefHat, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipeCount?: number;
}

export function RecipeCard({ recipeCount = 0 }: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/recipes')}
      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 cursor-pointer transition-all border-2 border-amber-200 hover:shadow-xl"
      style={{ minHeight: '280px' }}
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FEF3C7' }}>
        <ChefHat className="h-7 w-7" style={{ color: '#D97706' }} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
        Recipe Book
      </h3>

      {/* Description */}
      <p className="text-sm mb-6" style={{ color: '#92400E' }}>
        Preserve your family's treasured recipes forever
      </p>

      {/* Stats */}
      {recipeCount > 0 ? (
        <div className="mb-6">
          <div className="text-3xl font-bold" style={{ color: '#D97706' }}>{recipeCount}</div>
          <div className="text-sm" style={{ color: '#92400E' }}>Recipes preserved</div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-6 py-2 px-3 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
          <Plus className="h-4 w-4" style={{ color: '#D97706' }} />
          <span className="text-sm font-medium" style={{ color: '#92400E' }}>No recipes yet - start adding!</span>
        </div>
      )}

      {/* CTA */}
      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#D97706' }}>
        <span>{recipeCount > 0 ? 'View Recipes' : 'Start Your Recipe Book'}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}
