import React from 'react';
import { ArrowRight, BookOpen, Clock, Target, Plus, Gift, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { upsellFeatures } from '../../utils/mockData';
import { Link, useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // TODO: Fetch real stories from Supabase
const purchasedStories: any[] = [];
  const currentStory = purchasedStories.find(story => story.status === 'active') || purchasedStories[0];
  
  const totalProgress = purchasedStories.reduce((acc, story) => acc + story.progress, 0) / purchasedStories.length;

  const handleStartNewStory = () => {
    alert('🎉 Starting a new story!\n\nThis would redirect to Conversation 1 for the purchase flow.\n\nFor now, this is a demo of the new story creation process.');
    // In production: navigate to Conversation 1 purchase flow
  };

  const handleStoryClick = (storyId: string) => {
    // Navigate to Conversation 2 with story_id parameter
    navigate(`/questions?story_id=${storyId}`);
  };

  const handleUpgrade = (featureTitle: string, price: string) => {
    alert(`🎉 Upgrading to ${featureTitle} for ${price}!\n\nThis would redirect to payment processing.\nFor now, this is just a demo of the upgrade flow.`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold mb-3" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
          Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-lg" style={{ color: '#6B5B73' }}>
          Continue preserving your legacy
        </p>
      </div>

      {/* Current Story Progress */}
      {currentStory && (
        <div className="bg-white rounded-2xl p-8 mb-12 border-l-4 shadow-sm" style={{ borderLeftColor: '#8f1133', boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-6 w-6" style={{ color: '#8f1133' }} />
                <span className="text-sm font-medium" style={{ color: '#8f1133' }}>Currently Working On</span>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>{currentStory.title}</h2>
              <p className="mb-4" style={{ color: '#6B5B73' }}>{currentStory.description}</p>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: '#3A3A3A' }}>Progress</span>
                  <span className="text-sm font-medium" style={{ color: '#6B5B73' }}>{currentStory.answeredQuestions}/{currentStory.totalQuestions} questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ backgroundColor: '#8f1133', width: `${currentStory.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1" style={{ color: '#6B5B73' }}>{currentStory.progress}% complete</p>
              </div>

              <button
                onClick={() => handleStoryClick(currentStory.storyId)}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-colors group"
                style={{ backgroundColor: '#8f1133', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
              >
                <span>Continue Your Story</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Demo: Show celebration link for completed stories */}
              {currentStory.progress === 100 && (
                <Link
                  to={`/celebration?story_id=${currentStory.storyId}`}
                  className="inline-flex items-center space-x-2 ml-4 px-6 py-3 rounded-xl font-medium transition-colors border-2"
                  style={{ borderColor: '#8f1133', color: '#8f1133' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#8f1133';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#8f1133';
                  }}
                >
                  <span>View Celebration</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
            
            <div className="hidden lg:block ml-8">
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F5E6EA' }}>
                <BookOpen className="h-16 w-16" style={{ color: '#8f1133' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F5E6EA' }}>
              <BookOpen className="h-6 w-6" style={{ color: '#8f1133' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>{purchasedStories.length}</p>
              <p className="text-sm" style={{ color: '#6B5B73' }}>Active Stories</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F5E6EA' }}>
              <Target className="h-6 w-6" style={{ color: '#8f1133' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>
                {purchasedStories.reduce((acc, story) => acc + story.answeredQuestions, 0)}
              </p>
              <p className="text-sm" style={{ color: '#6B5B73' }}>Questions Answered</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100" style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#F5E6EA' }}>
              <Clock className="h-6 w-6" style={{ color: '#8f1133' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>{Math.round(totalProgress)}%</p>
              <p className="text-sm" style={{ color: '#6B5B73' }}>Overall Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Stories Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>My Stories</h2>
            <button
              onClick={handleStartNewStory}
              className="inline-flex items-center space-x-2 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              <Plus className="h-4 w-4" />
              <span>Start a New Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchasedStories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleStoryClick(story.storyId)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all cursor-pointer group hover:transform hover:-translate-y-1"
                style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(143, 17, 51, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.1)'}
              >
                {story.coverImage && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-serif font-semibold transition-colors" 
                            style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#8f1133'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#3A3A3A'}>
                          {story.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTitle = prompt('Enter new title:', story.title);
                            if (newTitle && newTitle.trim()) {
                              alert(`Story renamed to: "${newTitle}"\n\nThis would update the title in your database.`);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit title"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm" style={{ color: '#6B5B73' }}>{story.description}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs" style={{ color: '#6B5B73' }}>
                      <Clock className="h-3 w-3" />
                      <span>{new Date(story.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: '#3A3A3A' }}>Progress</span>
                      <span className="text-sm" style={{ color: '#6B5B73' }}>{story.answeredQuestions}/{story.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ backgroundColor: '#8f1133', width: `${story.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#6B5B73' }}>{story.progress}% complete</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        story.status === 'active' ? 'bg-green-500' : 
                        story.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs capitalize" style={{ color: '#6B5B73' }}>{story.status}</span>
                    </div>
                    <div className="transition-colors" style={{ color: '#8f1133' }}>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* New Story Card */}
            <div
              onClick={handleStartNewStory}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-all cursor-pointer group"
              style={{
                borderColor: '#d1d5db'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8f1133';
                e.currentTarget.style.background = 'linear-gradient(to bottom right, #fef2f2, #fdf2f8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.background = 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)';
              }}
            >
              <div className="mx-auto h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 transition-colors"
                   style={{ backgroundColor: '#e5e7eb' }}
                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5E6EA'}
                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}>
                <Plus className="h-8 w-8 text-gray-400 transition-colors"
                      style={{ color: '#9ca3af' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#8f1133'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a New Story</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create another beautiful legacy book to capture different aspects of your life
              </p>
              <div className="text-sm font-medium" style={{ color: '#8f1133' }}>
                Start Writing →
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Options Sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>Enhance Your Stories</h3>
            <p className="text-sm mb-6" style={{ color: '#6B5B73' }}>
              Add premium features to make your legacy even more special
            </p>
          </div>

          {upsellFeatures.slice(0, 3).map((feature) => (
            <div key={feature.id} className="bg-white rounded-xl border border-gray-100 p-6 transition-shadow"
                 style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.1)' }}
                 onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(143, 17, 51, 0.15)'}
                 onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.1)'}>
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#F5E6EA' }}>
                  {feature.icon === 'mic' && <Sparkles className="h-6 w-6" style={{ color: '#8f1133' }} />}
                  {feature.icon === 'book-open' && <BookOpen className="h-6 w-6" style={{ color: '#8f1133' }} />}
                  {feature.icon === 'chef-hat' && <Gift className="h-6 w-6" style={{ color: '#8f1133' }} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1" style={{ color: '#3A3A3A' }}>{feature.title}</h4>
                  <p className="text-sm mb-3" style={{ color: '#6B5B73' }}>{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: '#3A3A3A' }}>{feature.price}</span>
                    <button
                      onClick={() => handleUpgrade(feature.title, feature.price)}
                      className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: '#8f1133' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}