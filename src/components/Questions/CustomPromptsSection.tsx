import React, { useState } from 'react';
import { Plus, Camera, Mic, X, Save } from 'lucide-react';

interface CustomPrompt {
  id: string;
  subject: string;
  answer: string;
  photoUrl?: string;
  audioUrl?: string;
  isEditing: boolean;
}

interface CustomPromptsSectionProps {
  storyId: string;
  onSave: (prompt: Omit<CustomPrompt, 'id' | 'isEditing'>) => void;
}

export function CustomPromptsSection({ storyId, onSave }: CustomPromptsSectionProps) {
  const [customPrompts, setCustomPrompts] = useState<CustomPrompt[]>([]);
  const [showAddPrompt, setShowAddPrompt] = useState(false);

  const handleAddPrompt = () => {
    const newPrompt: CustomPrompt = {
      id: `custom_${Date.now()}`,
      subject: '',
      answer: '',
      isEditing: true
    };
    setCustomPrompts([...customPrompts, newPrompt]);
    setShowAddPrompt(false);
  };

  const handleSavePrompt = (promptId: string) => {
    const prompt = customPrompts.find(p => p.id === promptId);
    if (prompt && prompt.answer.trim()) {
      // Save to Supabase (mock for now)
      onSave({
        subject: prompt.subject,
        answer: prompt.answer,
        photoUrl: prompt.photoUrl,
        audioUrl: prompt.audioUrl
      });

      // Update local state
      setCustomPrompts(prev => 
        prev.map(p => 
          p.id === promptId ? { ...p, isEditing: false } : p
        )
      );
    }
  };

  const handleEditPrompt = (promptId: string) => {
    setCustomPrompts(prev => 
      prev.map(p => 
        p.id === promptId ? { ...p, isEditing: true } : p
      )
    );
  };

  const handleDeletePrompt = (promptId: string) => {
    setCustomPrompts(prev => prev.filter(p => p.id !== promptId));
  };

  const handleUpdatePrompt = (promptId: string, field: keyof CustomPrompt, value: string) => {
    setCustomPrompts(prev => 
      prev.map(p => 
        p.id === promptId ? { ...p, [field]: value } : p
      )
    );
  };

  const handlePhotoUpload = (promptId: string) => {
    // Mock photo upload
    const mockPhotoUrl = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2';
    handleUpdatePrompt(promptId, 'photoUrl', mockPhotoUrl);
    alert('📸 Photo uploaded successfully!\n\nIn production, this would upload to your storage and save the URL.');
  };

  const handleAudioRecord = (promptId: string) => {
    // Mock audio recording
    alert('🎤 Audio recording feature!\n\nThis would:\n• Start voice recording\n• Save audio file\n• Attach to your story\n\nNote: Available with Voice Clone upgrade.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Completion Message */}
      <div className="bg-gradient-to-r from-burgundy-50 to-wine-50 rounded-2xl p-8 mb-8 text-center">
        <div className="mx-auto h-16 w-16 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-burgundy-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Story, Your Way</h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Is there anything we didn't cover? This is your story, so if you need to add more, simply create your own prompts +
        </p>
        
        {!showAddPrompt && customPrompts.length === 0 && (
          <button
            onClick={() => setShowAddPrompt(true)}
            className="inline-flex items-center space-x-2 bg-burgundy-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-burgundy-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your Own Prompt</span>
          </button>
        )}
      </div>

      {/* Custom Prompts List */}
      <div className="space-y-6">
        {customPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {prompt.isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Create Your Prompt</h3>
                  <button
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject (optional)
                  </label>
                  <input
                    type="text"
                    value={prompt.subject}
                    onChange={(e) => handleUpdatePrompt(prompt.id, 'subject', e.target.value)}
                    placeholder="What would you like to share about?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story
                  </label>
                  <textarea
                    value={prompt.answer}
                    onChange={(e) => handleUpdatePrompt(prompt.id, 'answer', e.target.value)}
                    placeholder="Share your thoughts, memories, or anything else you'd like to include in your story..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Media Upload Options */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePhotoUpload(prompt.id)}
                    className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Add Photo</span>
                  </button>

                  <button
                    onClick={() => handleAudioRecord(prompt.id)}
                    className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                    <span>Record Audio</span>
                  </button>
                </div>

                {/* Photo Preview */}
                {prompt.photoUrl && (
                  <div className="mt-4">
                    <img
                      src={prompt.photoUrl}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSavePrompt(prompt.id)}
                    disabled={!prompt.answer.trim()}
                    className="inline-flex items-center space-x-2 bg-burgundy-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-burgundy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {prompt.subject && (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{prompt.subject}</h4>
                    )}
                    <p className="text-gray-700 whitespace-pre-wrap">{prompt.answer}</p>
                    
                    {prompt.photoUrl && (
                      <div className="mt-4">
                        <img
                          src={prompt.photoUrl}
                          alt="Story photo"
                          className="w-48 h-36 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleEditPrompt(prompt.id)}
                    className="ml-4 px-3 py-1 text-sm text-burgundy-600 hover:text-burgundy-700 font-medium"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Another Prompt Button */}
        {(customPrompts.length > 0 || showAddPrompt) && (
          <div className="text-center">
            <button
              onClick={handleAddPrompt}
              className="inline-flex items-center space-x-2 bg-white text-burgundy-700 px-6 py-3 rounded-xl font-medium border-2 border-burgundy-200 hover:bg-burgundy-50 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Another Prompt</span>
            </button>
          </div>
        )}
      </div>

      {/* Continue Button */}
      {customPrompts.some(p => !p.isEditing) && (
        <div className="mt-8 text-center">
          <button className="bg-burgundy-700 text-white px-8 py-4 rounded-xl font-medium hover:bg-burgundy-800 transition-colors">
            Continue to Story Review
          </button>
        </div>
      )}
    </div>
  );
}