import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { GiftChoice } from './pages/GiftChoice';
import { SignUpForm } from './components/Auth/SignUpForm';
import { RoleSelection } from './pages/RoleSelection';
import { AddStory } from './pages/AddStory';
import { Navigation } from './components/Layout/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectsList } from './components/Projects/ProjectsList';
import { UpgradeOptions } from './components/Upsells/UpgradeOptions';
import { ExportPage } from './components/Export/ExportPage';
import { CustomPromptsSection } from './components/Questions/CustomPromptsSection';
import { StoryCompleteCelebration } from './components/Celebration/StoryCompleteCelebration';
import QuestionInterfaceWrapper from './components/QuestionInterfaceWrapper';

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
	<Route path="/gift-choice" element={<GiftChoice />} />
	<Route 
	  path="/signup" 
	  element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUpForm />} 
	/>
	<Route path="/role-selection" element={<RoleSelection />} />
	<Route path="/add-story" element={<AddStory />} />
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
  path="/enhance"
  element={
    <PrivateRoute>
      <UpgradeOptions />
    </PrivateRoute>
  }
/>
        <Route
  path="/view"
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
              <QuestionInterfaceWrapper />
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