import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectsList } from './components/Projects/ProjectsList';
import { UpgradeOptions } from './components/Upsells/UpgradeOptions';
import { ExportPage } from './components/Export/ExportPage';
import { CustomPromptsSection } from './components/Questions/CustomPromptsSection';
import { StoryCompleteCelebration } from './components/Celebration/StoryCompleteCelebration';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>{children}</main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} 
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ProjectsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/upsells"
          element={
            <PrivateRoute>
              <UpgradeOptions />
            </PrivateRoute>
          }
        />
        <Route
          path="/export"
          element={
            <PrivateRoute>
              <ExportPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <PrivateRoute>
              <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl p-8 text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Q&A Flow - Conversation 2</h1>
                  <p className="text-gray-600 mb-6">
                    This is where Conversation 2's Q&A flow will be integrated.
                    <br />
                    Story ID from URL: {new URLSearchParams(window.location.search).get('story_id') || new URLSearchParams(window.location.search).get('project_id') || 'No story selected'}
                  </p>
                  <button className="bg-burgundy-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-burgundy-800 transition-colors">
                    Start Next Question
                  </button>
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/custom-prompts"
          element={
            <PrivateRoute>
              <CustomPromptsSection 
                storyId={new URLSearchParams(window.location.search).get('story_id') || 'demo_story'}
                onSave={(prompt) => {
                  // Mock save to Supabase
                  console.log('Saving custom prompt:', prompt);
                  alert(`✅ Custom prompt saved!\n\nSubject: ${prompt.subject || 'No subject'}\nAnswer: ${prompt.answer.substring(0, 50)}...\n\nThis would be saved to Supabase under story_id.`);
                }}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/celebration"
          element={
            <PrivateRoute>
              <StoryCompleteCelebration
                storyId={new URLSearchParams(window.location.search).get('story_id') || 'demo_story'}
                storyTitle="Sarah's Life Story"
                role="Mom"
                completionDate="2024-12-19"
                totalQuestions={72}
                onStartNewStory={(role) => {
                  alert(`🎉 Starting ${role}'s story!\n\nThis would redirect to the purchase flow for a new story role.`);
                }}
                onOrderBook={() => {
                  alert('📚 Redirecting to Stripe checkout for hardcover book order!\n\nThis would process the payment and arrange printing/shipping.');
                }}
              />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;