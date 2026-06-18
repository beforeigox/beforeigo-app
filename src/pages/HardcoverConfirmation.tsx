import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, BookOpen, ArrowRight, Check } from 'lucide-react';
import { coverDesigns } from '../components/Export/BookCoverDesigns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function HardcoverConfirmation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState<any>(null);
  const [selectedCoverId, setSelectedCoverId] = useState('classic-burgundy');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadStory() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('Stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStory(data);
        const role = data.role?.toLowerCase() || '';
        if (role === 'dad' || role === 'grandpa') {
          setSelectedCoverId('classic-navy');
        } else {
          setSelectedCoverId('classic-burgundy');
        }
      }
    }
    loadStory();
  }, [user?.id]);

  const getFilteredCovers = () => {
    const role = story?.role?.toLowerCase() || '';
    if (role === 'dad' || role === 'grandpa' || role === 'son') {
      return coverDesigns.filter(cover => cover.colorScheme === 'navy');
    }
    if (role === 'mom' || role === 'grandma' || role === 'daughter') {
      return coverDesigns.filter(cover => cover.colorScheme === 'burgundy');
    }
    return coverDesigns;
  };

  const handleSaveCover = async () => {
    setSaving(true);
    if (story) {
      await supabase
        .from('Stories')
        .update({ cover_design_id: selectedCoverId, updated_at: new Date().toISOString() })
        .eq('id', story.id);
    }
    setSaving(false);
    navigate('/dashboard');
  };

  const filteredCovers = getFilteredCovers();
  const progress = story?.progress || 0;
  const isComplete = progress >= 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#10B981' }}>
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Your Hardcover Book is Ordered!
          </h1>
          <p className="text-xl mb-2" style={{ color: '#6B5B73' }}>
            Premium museum-quality hardcover • $53
          </p>
          {!isComplete && (
            <p className="text-lg" style={{ color: '#8f1133' }}>
              Your book will ship when your story reaches 100% complete
            </p>
          )}
        </div>

        {/* Progress Card */}
        {!isComplete && (
          <div className="bg-white rounded-2xl p-8 mb-8" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#3A3A3A' }}>Story Progress</h3>
              <span className="text-2xl font-bold" style={{ color: '#8f1133' }}>{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#F5E6EA' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#8f1133' }}></div>
            </div>
            <p className="text-sm mt-3" style={{ color: '#6B5B73' }}>
              {story?.answered_questions || 0} of {story?.total_questions || 72} questions answered
            </p>
          </div>
        )}

        {/* Cover Selection */}
        <div className="bg-white rounded-2xl p-8 mb-8" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#3A3A3A' }}>Choose Your Cover Design</h3>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {filteredCovers.map((cover) => {
              const CoverComponent = cover.component;
              const isSelected = selectedCoverId === cover.id;
              const accentColor = cover.colorScheme === 'navy' ? '#1e3a5f' : '#8f1133';
              return (
                <div
                  key={cover.id}
                  onClick={() => setSelectedCoverId(cover.id)}
                  className="cursor-pointer transition-all hover:scale-105"
                >
                  <div
                    className="aspect-[3/4] rounded-xl overflow-hidden relative"
                    style={{
                      boxShadow: isSelected ? `0 0 0 4px ${accentColor}` : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: isSelected ? '2px solid white' : 'none'
                    }}
                  >
                    <CoverComponent
                      title={user?.full_name || 'Your Story'}
                      subtitle="A Personal Journey"
                      role={story?.role || 'Mom'}
                    />
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-white rounded-full p-2">
                        <Check className="h-5 w-5" style={{ color: accentColor }} />
                      </div>
                    )}
                  </div>
                  <p className="text-center mt-3 font-medium" style={{ color: isSelected ? accentColor : '#3A3A3A' }}>
                    {cover.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-2xl p-8 mb-8" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#3A3A3A' }}>What Happens Next</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#F5E6EA' }}>
                <span className="text-xs font-bold" style={{ color: '#8f1133' }}>1</span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#3A3A3A' }}>Complete your story</p>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Answer all 72 questions to reach 100%</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#F5E6EA' }}>
                <span className="text-xs font-bold" style={{ color: '#8f1133' }}>2</span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#3A3A3A' }}>We print your book</p>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Museum-quality linen cover with archival paper</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#F5E6EA' }}>
                <span className="text-xs font-bold" style={{ color: '#8f1133' }}>3</span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#3A3A3A' }}>Delivered to your door</p>
                <p className="text-sm" style={{ color: '#6B5B73' }}>Ships within 5-7 business days after completion</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveCover}
            disabled={saving}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: '#8f1133' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
          >
            <span>{saving ? 'Saving...' : 'Save Cover & Continue to Story'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: '#6B5B73' }}>
          You'll receive an email confirmation with your order details
        </p>
      </div>
    </div>
  );
}
