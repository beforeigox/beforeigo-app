import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import QuestionInterface from './QuestionInterface';
import questionsData from '../data/before_i_go_questions_master.json';

export default function QuestionInterfaceWrapper() {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get('story_id');
  const [story, setStory] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStory() {
      if (!storyId) {
        setLoading(false);
        return;
      }

      // Load story from Supabase
      const { data: storyData } = await supabase
        .from('Stories')
        .select('*')
        .eq('id', storyId)
        .single();

      if (storyData) {
        setStory(storyData);
        
        // Find the questions for this story's role
        const roleData = (questionsData as any).roles.find(
  	(r: any) => r.id.toLowerCase() === storyData.role.toLowerCase()
	);
        
        if (roleData) {
          // Flatten all questions from all categories
          const allQuestions = roleData.categories.flatMap((cat: any, catIndex: number) => 
  cat.questions.map((q: any, qIndex: number) => ({
    ...q,
    id: `${cat.name.toLowerCase().replace(/\s+/g, '_')}_${qIndex}`,
    category: cat.name,
    categoryQuote: cat.quote
  }))
);
          setQuestions(allQuestions);
        }
      }
      
      setLoading(false);
    }

    loadStory();
  }, [storyId]);

  if (loading) {
    return <div className="p-8 text-center">Loading your story...</div>;
  }

  if (!storyId || !story) {
    return <div className="p-8 text-center">No story selected</div>;
  }
return (
    <QuestionInterface 
      story={story}
      questions={questions}
      onBack={() => window.location.href = '/dashboard'}
    />
  );
}