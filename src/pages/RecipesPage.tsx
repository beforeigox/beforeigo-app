import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat,
  Plus,
  ArrowLeft,
  X,
  Camera,
  Trash2,
  Pencil,
  Clock,
  Users,
  Check,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Recipe {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: string;
  servings: string;
  photo_url: string | null;
  created_at: string;
}

type RecipeDraft = Omit<Recipe, 'id' | 'user_id' | 'created_at'>;

const CATEGORIES = [
  'Mains',
  'Sides',
  'Desserts',
  'Breakfast',
  'Soups & Stews',
  'Breads & Baking',
  'Drinks',
  'Other',
] as const;

const CATEGORY_EMOJI: Record<string, string> = {
  Mains: '🍲',
  Sides: '🥗',
  Desserts: '🍰',
  Breakfast: '🍳',
  'Soups & Stews': '🥘',
  'Breads & Baking': '🍞',
  Drinks: '🍹',
  Other: '🍽️',
};

const emptyDraft: RecipeDraft = {
  title: '',
  category: 'Mains',
  description: '',
  ingredients: '',
  instructions: '',
  prep_time: '',
  servings: '',
  photo_url: null,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export function RecipesPage() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [viewing, setViewing] = useState<Recipe | null>(null);

  // -------------------------------------------------------------------------
  // Load recipes for the signed-in user
  // -------------------------------------------------------------------------
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (active) setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setRecipes(data || []);
      } catch (err) {
        console.error('Failed to load recipes:', err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleSaved = (recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev]);
    setShowEditor(false);
  };

  const handleUpdated = (recipe: Recipe) => {
    setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? recipe : r)));
    setEditing(null);
    setViewing(recipe);
  };

  const openEditor = (recipe: Recipe) => {
    setViewing(null);
    setEditing(recipe);
  };

  const handleDelete = async (id: string) => {
    const prev = recipes;
    setRecipes((r) => r.filter((x) => x.id !== id));
    setViewing(null);
    try {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Delete failed, restoring:', err);
      setRecipes(prev);
    }
  };

  const filtered =
    activeCategory === 'All'
      ? recipes
      : recipes.filter((r) => r.category === activeCategory);

  const usedCategories = ['All', ...CATEGORIES.filter((c) => recipes.some((r) => r.category === c))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #8f1133 0%, #650c24 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1
                  className="text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: 'Crimson Text, serif' }}
                >
                  Your Recipe Book
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {recipes.length === 0
                    ? "Preserve your family's treasured recipes forever"
                    : `${recipes.length} ${recipes.length === 1 ? 'recipe' : 'recipes'} preserved for generations`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEditor(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'white', color: '#8f1133' }}
            >
              <Plus className="h-5 w-5" />
              Add Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Category filter */}
        {recipes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {usedCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={
                    isActive
                      ? { backgroundColor: '#8f1133', color: 'white' }
                      : { backgroundColor: 'white', color: '#6B5B73', border: '1px solid #EADBE0' }
                  }
                >
                  {cat === 'All' ? 'All Recipes' : `${CATEGORY_EMOJI[cat]} ${cat}`}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : recipes.length === 0 ? (
          <EmptyState onAdd={() => setShowEditor(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((recipe) => (
              <RecipeGridCard key={recipe.id} recipe={recipe} onClick={() => setViewing(recipe)} />
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <RecipeEditor onClose={() => setShowEditor(false)} onSaved={handleSaved} />
      )}
      {editing && (
        <RecipeEditor
          existing={editing}
          onClose={() => setEditing(null)}
          onUpdated={handleUpdated}
        />
      )}
      {viewing && (
        <RecipeViewer
          recipe={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => openEditor(viewing)}
          onDelete={() => handleDelete(viewing.id)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid card
// ---------------------------------------------------------------------------
function RecipeGridCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all border border-gray-100"
      style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.08)' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(143, 17, 51, 0.18)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.08)')
      }
    >
      {/* Photo / placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ backgroundColor: '#F5E6EA' }}>
        {recipe.photo_url ? (
          <img
            src={recipe.photo_url}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="h-12 w-12" style={{ color: '#D8A0B0' }} />
          </div>
        )}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#8f1133' }}
        >
          {CATEGORY_EMOJI[recipe.category]} {recipe.category}
        </div>
      </div>

      <div className="p-5">
        <h3
          className="text-xl font-bold mb-1 truncate"
          style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}
        >
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-sm line-clamp-2 mb-4" style={{ color: '#6B5B73' }}>
            {recipe.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-xs" style={{ color: '#9B8A93' }}>
          {recipe.prep_time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.prep_time}
            </span>
          )}
          {recipe.servings && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {recipe.servings}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ backgroundColor: '#F5E6EA' }}
      >
        <BookOpen className="h-12 w-12" style={{ color: '#8f1133' }} />
      </div>
      <h2
        className="text-3xl font-bold mb-3"
        style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}
      >
        Your cookbook starts here
      </h2>
      <p className="max-w-md mb-8" style={{ color: '#6B5B73' }}>
        Every family has dishes that tell a story. Add the recipes your loved ones
        will want to make for years to come.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: '#8f1133' }}
      >
        <Plus className="h-5 w-5" />
        Add Your First Recipe
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <div className="h-44 animate-pulse" style={{ backgroundColor: '#F5E6EA' }} />
          <div className="p-5 space-y-3">
            <div className="h-5 rounded animate-pulse w-2/3" style={{ backgroundColor: '#EADBE0' }} />
            <div className="h-4 rounded animate-pulse w-full" style={{ backgroundColor: '#F0E4E8' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editor modal
// ---------------------------------------------------------------------------
function RecipeEditor({
  existing,
  onClose,
  onSaved,
  onUpdated,
}: {
  existing?: Recipe;
  onClose: () => void;
  onSaved?: (r: Recipe) => void;
  onUpdated?: (r: Recipe) => void;
}) {
  const isEditing = !!existing;
  const [draft, setDraft] = useState<RecipeDraft>(
    existing
      ? {
          title: existing.title,
          category: existing.category,
          description: existing.description,
          ingredients: existing.ingredients,
          instructions: existing.instructions,
          prep_time: existing.prep_time,
          servings: existing.servings,
          photo_url: existing.photo_url,
        }
      : emptyDraft
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof RecipeDraft>(key: K, value: RecipeDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      const ext = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('recipe-photos')
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from('recipe-photos').getPublicUrl(path);
      set('photo_url', data.publicUrl);
    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setError('Photo upload failed. You can still save the recipe without a photo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!draft.title.trim()) {
      setError('Please give your recipe a name.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');

      if (isEditing && existing) {
        const { data, error: updErr } = await supabase
          .from('recipes')
          .update({ ...draft })
          .eq('id', existing.id)
          .select()
          .single();
        if (updErr) throw updErr;
        onUpdated?.(data as Recipe);
      } else {
        const { data, error: insErr } = await supabase
          .from('recipes')
          .insert([{ ...draft, user_id: user.id }])
          .select()
          .single();
        if (insErr) throw insErr;
        onSaved?.(data as Recipe);
      }
    } catch (err: any) {
      console.error('Save failed:', err);
      setError('Could not save the recipe. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ backgroundColor: '#8f1133' }}
        >
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Crimson Text, serif' }}>
            {isEditing ? 'Edit Recipe' : 'Add a Recipe'}
          </h2>
          <button onClick={onClose} className="text-white opacity-80 hover:opacity-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="overflow-y-auto px-7 py-6 space-y-5">
          {/* Photo */}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full h-44 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-colors overflow-hidden"
              style={{ borderColor: '#E0CAD2', backgroundColor: '#FBF5F7' }}
            >
              {draft.photo_url ? (
                <img src={draft.photo_url} alt="Recipe" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="h-8 w-8 mb-2" style={{ color: '#C99BAB' }} />
                  <span className="text-sm font-medium" style={{ color: '#8f1133' }}>
                    {uploading ? 'Uploading…' : 'Add a photo'}
                  </span>
                </>
              )}
            </button>
          </div>

          <Field label="Recipe Name">
            <input
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Grandma's Sunday Roast"
              className="form-input"
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => set('category', e.target.value)}
                className="form-input"
                style={inputStyle}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Prep Time">
              <input
                value={draft.prep_time}
                onChange={(e) => set('prep_time', e.target.value)}
                placeholder="45 mins"
                className="form-input"
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label="Servings">
            <input
              value={draft.servings}
              onChange={(e) => set('servings', e.target.value)}
              placeholder="Serves 6"
              className="form-input"
              style={inputStyle}
            />
          </Field>

          <Field label="A short note (optional)">
            <textarea
              value={draft.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="The dish she made every Sunday after church…"
              rows={2}
              className="form-input resize-none"
              style={inputStyle}
            />
          </Field>

          <Field label="Ingredients">
            <textarea
              value={draft.ingredients}
              onChange={(e) => set('ingredients', e.target.value)}
              placeholder={'2 lbs beef chuck\n3 carrots, chopped\n1 onion…'}
              rows={5}
              className="form-input resize-none"
              style={inputStyle}
            />
          </Field>

          <Field label="Instructions">
            <textarea
              value={draft.instructions}
              onChange={(e) => set('instructions', e.target.value)}
              placeholder={'1. Preheat oven to 325°F…\n2. Season the beef…'}
              rows={6}
              className="form-input resize-none"
              style={inputStyle}
            />
          </Field>

          {error && (
            <p className="text-sm" style={{ color: '#8f1133' }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-5 border-t flex-shrink-0" style={{ borderColor: '#F0E8EB' }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium"
            style={{ color: '#6B5B73' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#8f1133' }}
          >
            {saving ? 'Saving…' : (<><Check className="h-4 w-4" /> {isEditing ? 'Save Changes' : 'Save Recipe'}</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Viewer modal
// ---------------------------------------------------------------------------
function RecipeViewer({
  recipe,
  onClose,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Photo header */}
        <div className="relative h-56 flex-shrink-0" style={{ backgroundColor: '#F5E6EA' }}>
          {recipe.photo_url ? (
            <img src={recipe.photo_url} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ChefHat className="h-16 w-16" style={{ color: '#D8A0B0' }} />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#3A3A3A' }}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#8f1133' }}
          >
            {CATEGORY_EMOJI[recipe.category]} {recipe.category}
          </div>
        </div>

        <div className="overflow-y-auto px-8 py-6">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}
          >
            {recipe.title}
          </h2>

          <div className="flex items-center gap-5 text-sm mb-5" style={{ color: '#9B8A93' }}>
            {recipe.prep_time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {recipe.prep_time}
              </span>
            )}
            {recipe.servings && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {recipe.servings}
              </span>
            )}
          </div>

          {recipe.description && (
            <p className="italic mb-6 pb-6 border-b" style={{ color: '#6B5B73', borderColor: '#F0E8EB' }}>
              {recipe.description}
            </p>
          )}

          {recipe.ingredients && (
            <section className="mb-6">
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}
              >
                Ingredients
              </h3>
              <p className="whitespace-pre-line leading-relaxed" style={{ color: '#3A3A3A' }}>
                {recipe.ingredients}
              </p>
            </section>
          )}

          {recipe.instructions && (
            <section className="mb-6">
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}
              >
                Instructions
              </h3>
              <p className="whitespace-pre-line leading-relaxed" style={{ color: '#3A3A3A' }}>
                {recipe.instructions}
              </p>
            </section>
          )}

          {/* Actions */}
          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: '#F0E8EB' }}>
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: '#6B5B73' }}>
                  Delete this recipe?
                </span>
                <button
                  onClick={onDelete}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: '#8f1133' }}
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ color: '#6B5B73' }}
                >
                  Keep it
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: '#8f1133' }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Recipe
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: '#9B8A93' }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: '#3A3A3A' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '12px',
  border: '1px solid #E0CAD2',
  backgroundColor: '#FFFFFF',
  color: '#3A3A3A',
  fontSize: '14px',
  outline: 'none',
};

export default RecipesPage;
