import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Heart, Baby, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const roles = [
  { id: 'mom', label: 'Mom', icon: Heart, description: 'Share your journey as a mother' },
  { id: 'dad', label: 'Dad', icon: User, description: 'Tell your story as a father' },
  { id: 'grandma', label: 'Grandma', icon: Users, description: 'Preserve your legacy as a grandmother' },
  { id: 'grandpa', label: 'Grandpa', icon: Users, description: 'Share your wisdom as a grandfather' },
  { id: 'aunt', label: 'Aunt', icon: Heart, description: 'Tell your unique family story' },
  { id: 'uncle', label: 'Uncle', icon: User, description: 'Share your perspective and experiences' },
  { id: 'sibling', label: 'Sibling', icon: Baby, description: 'Document your childhood and family memories' },
  { id: 'mentor', label: 'Mentor/Teacher', icon: GraduationCap, description: 'Share lessons and wisdom' },
];

export function RoleSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateStory = async () => {
    if (!selectedRole || !user) return;

    setCreating(true);
    try {
      const roleLabel = roles.find(r => r.id === selectedRole)?.label || selectedRole;
      
      const { data, error } = await supabase
        .from('Stories')
        .insert([{
          user_id: user.id,
          role: roleLabel,
          title: `${roleLabel}'s Story`,
          description: `My story as a ${roleLabel.toLowerCase()}`,
          progress: 0,
          total_questions: 72,
          answered_questions: 0,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      // Redirect to questions with story_id
      navigate(`/questions?story_id=${data.id}`);

    } catch (error: any) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-burgundy-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Choose Your Role
          </h1>
          <p className="text-warmGray-600">
            Select the role that best describes your story
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-burgundy-600 bg-burgundy-50'
                    : 'border-warmGray-200 hover:border-warmGray-300'
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-burgundy-600' : 'text-warmGray-400'}`} />
                <div className="font-semibold text-warmGray-900">{role.label}</div>
                <div className="text-xs text-warmGray-600 mt-1">{role.description}</div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCreateStory}
          disabled={!selectedRole || creating}
          className="w-full bg-burgundy-600 text-white py-4 rounded-xl font-semibold hover:from-burgundy-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {creating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating your story...</span>
            </>
          ) : (
            <>
              <span>Start My Story</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}