import React from 'react';
import { Plus, Calendar, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function ProjectsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadStories() {
      if (!user?.id) return;

      const { data } = await supabase
        .from('Stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setStories(data);
      }
      setLoading(false);
    }
    loadStories();
  }, [user?.id]);

  const handleNewProject = () => {
    navigate('/role-selection');
  };

  const handleStoryClick = (storyId: string) => {
    navigate(`/questions?story_id=${storyId}`);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading your stories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
          <p className="text-gray-600 mt-1">Manage and continue your life story projects</p>
        </div>
        <button 
          onClick={handleNewProject}
          className="inline-flex items-center space-x-2 bg-burgundy-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-burgundy-800 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Story</span>
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
          <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your First Story</h3>
          <p className="text-gray-600 mb-4 max-w-sm mx-auto">
            Create your first story to capture your life's precious memories.
          </p>
          <button 
            onClick={handleNewProject}
            className="inline-flex items-center space-x-2 bg-burgundy-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-burgundy-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Start Your Story</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleStoryClick(story.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{story.title}</h3>
                    <p className="text-gray-600 text-sm">{story.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{story.answered_questions}/{story.total_questions}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-burgundy-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${story.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{story.progress}% complete</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(story.updated_at || story.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="inline-flex items-center space-x-2 text-burgundy-600 hover:text-burgundy-700 font-medium text-sm group">
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}