import { useState, useEffect } from 'react';
import { ChefHat, ArrowRight, Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface RecipeCardProps {
  recipeCount?: number;
}

export function RecipeCard({ recipeCount = 0 }: RecipeCardProps) {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const plan = (user?.user_metadata?.plan as string) || '';
        const access = plan.includes('_recipe') || plan === 'legacy';
        if (active) setHasAccess(access);
      } catch {
        if (active) setHasAccess(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Locked variant — bought a plan without the recipe add-on
  if (hasAccess === false) {
    return (
      <div
        onClick={() => navigate('/recipes')}
        className="rounded-2xl p-8 cursor-pointer transition-all border-2 hover:shadow-xl"
        style={{ backgroundColor: '#FBF5F7', borderColor: '#EAD7DD', minHeight: '280px' }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
          <Lock className="h-7 w-7" style={{ color: '#8f1133' }} />
        </div>

        <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
          Recipe Book
        </h3>

        <p className="text-sm mb-6" style={{ color: '#6B5B73' }}>
          Preserve your family's treasured recipes forever
        </p>

        <div className="flex items-center gap-2 mb-6 py-2 px-3 rounded-lg" style={{ backgroundColor: '#F5E6EA' }}>
          <span className="text-sm font-medium" style={{ color: '#8f1133' }}>Add-on · Unlock for $8</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#8f1133' }}>
          <span>Unlock Recipe Book</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    );
  }

  // Unlocked variant (also shown while access is loading, to avoid a flash of locked)
  return (
    <div
      onClick={() => navigate('/recipes')}
      className="rounded-2xl p-8 cursor-pointer transition-all border-2 hover:shadow-xl"
      style={{ backgroundColor: '#FBF5F7', borderColor: '#EAD7DD', minHeight: '280px' }}
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
        <ChefHat className="h-7 w-7" style={{ color: '#8f1133' }} />
      </div>

      <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
        Recipe Book
      </h3>

      <p className="text-sm mb-6" style={{ color: '#6B5B73' }}>
        Preserve your family's treasured recipes forever
      </p>

      {recipeCount > 0 ? (
        <div className="mb-6">
          <div className="text-3xl font-bold" style={{ color: '#8f1133' }}>{recipeCount}</div>
          <div className="text-sm" style={{ color: '#6B5B73' }}>Recipes preserved</div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-6 py-2 px-3 rounded-lg" style={{ backgroundColor: '#F5E6EA' }}>
          <Plus className="h-4 w-4" style={{ color: '#8f1133' }} />
          <span className="text-sm font-medium" style={{ color: '#8f1133' }}>No recipes yet - start adding!</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#8f1133' }}>
        <span>{recipeCount > 0 ? 'View Recipes' : 'Start Your Recipe Book'}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}
