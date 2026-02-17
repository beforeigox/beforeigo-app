import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Story {
  id: string;
  title: string;
  role: string;
  user_id: string;
  answered_questions: number;
  total_questions: number;
  progress: number;
  created_at: string;
}

interface Response {
  id: string;
  question_id: string;
  answer: string;
  image_urls: string[];
  image_captions: string[];
  is_completed: boolean;
}

interface Question {
  id: string;
  question: string;
  category: string;
  categoryQuote: string;
}

export function StoryShare() {
  const { story_id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  useEffect(() => {
    async function loadStory() {
      if (!story_id) return;

      const { data: storyData } = await supabase
        .from('Stories')
        .select('*')
        .eq('id', story_id)
        .single();

      if (!storyData) {
        setLoading(false);
        return;
      }

      setStory(storyData);

      const { data: responsesData } = await supabase
        .from('responses')
        .select('*')
        .eq('story_id', story_id)
        .eq('is_completed', true);

      if (responsesData) {
        setResponses(responsesData);
      }

      // Load questions JSON
      try {
        const questionsData = await import('../data/before_i_go_questions_master.json');
        const roleData = (questionsData as any).roles.find(
          (r: any) => r.id.toLowerCase() === storyData.role.toLowerCase() ||
            r.name.toLowerCase() === storyData.role.toLowerCase()
        );

        if (roleData) {
          const allQuestions = roleData.categories.flatMap((cat: any, catIndex: number) =>
            cat.questions.map((q: any, qIndex: number) => ({
              ...q,
              id: `${cat.name.toLowerCase().replace(/\s+/g, '_')}_${qIndex}`,
              category: cat.name,
              categoryQuote: cat.quote,
            }))
          );
          setQuestions(allQuestions);
          if (allQuestions.length > 0) {
            setActiveChapter(allQuestions[0].category);
          }
        }
      } catch (e) {
        console.error('Failed to load questions', e);
      }

      setLoading(false);
    }

    loadStory();
  }, [story_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#8f1133' }}></div>
          <p style={{ color: '#6B5B73' }}>Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F5E6EA' }}>
            <BookOpen className="h-10 w-10" style={{ color: '#8f1133' }} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-3" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Story Not Found
          </h2>
          <p style={{ color: '#6B5B73' }}>This story may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  // Group questions by category and match with responses
  const responseMap = new Map(responses.map(r => [r.question_id, r]));
  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = { quote: q.categoryQuote, questions: [] };
    const response = responseMap.get(q.id);
    if (response?.is_completed) {
      acc[q.category].questions.push({ ...q, response });
    }
    return acc;
  }, {} as Record<string, { quote: string; questions: any[] }>);

  const chapters = Object.entries(groupedQuestions).filter(([_, data]) => data.questions.length > 0);
  const totalAnswered = responses.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#8f1133' }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#FAF7F2', transform: 'translate(30%, -30%)' }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#FAF7F2', transform: 'translate(-30%, 30%)' }}></div>

        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-5 w-5 text-white opacity-70" />
            <span className="text-white opacity-70 text-sm font-medium uppercase tracking-widest">Before I Go</span>
            <Heart className="h-5 w-5 text-white opacity-70" />
          </div>
          <h1 className="text-6xl font-serif font-bold text-white mb-4" style={{ fontFamily: 'Crimson Text, serif', lineHeight: '1.15' }}>
            {story.title}
          </h1>
          <p className="text-xl text-white opacity-80 mb-8">
            A legacy story · {totalAnswered} memories preserved
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalAnswered}</div>
              <div className="text-white opacity-70 text-sm">Questions Answered</div>
            </div>
            <div className="w-px h-12 bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{chapters.length}</div>
              <div className="text-white opacity-70 text-sm">Chapters</div>
            </div>
            <div className="w-px h-12 bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{story.progress}%</div>
              <div className="text-white opacity-70 text-sm">Complete</div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="relative h-16">
          <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="#FAF7F2" />
          </svg>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: '#FAF7F2', borderBottomColor: '#E5D5D8' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {chapters.map(([chapter, data]) => (
              <button
                key={chapter}
                onClick={() => {
                  setActiveChapter(chapter);
                  document.getElementById(`chapter-${chapter.replace(/\s+/g, '-')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={
                  activeChapter === chapter
                    ? { backgroundColor: '#8f1133', color: 'white' }
                    : { backgroundColor: '#F5E6EA', color: '#8f1133' }
                }
              >
                {chapter} ({data.questions.length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {chapters.map(([chapter, data], chapterIdx) => (
          <div
            key={chapter}
            id={`chapter-${chapter.replace(/\s+/g, '-')}`}
            className="mb-20"
          >
            {/* Chapter Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#F5E6EA', color: '#8f1133' }}>
                Chapter {chapterIdx + 1}
              </div>
              <h2 className="text-4xl font-serif font-bold mb-6" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
                {chapter}
              </h2>
              {data.quote && (
                <div className="relative max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="h-px flex-1" style={{ backgroundColor: '#E5D5D8' }}></div>
                    <Heart className="h-4 w-4" style={{ color: '#8f1133', opacity: 0.5 }} />
                    <div className="h-px flex-1" style={{ backgroundColor: '#E5D5D8' }}></div>
                  </div>
                  <p className="text-lg italic" style={{ color: '#8f1133', fontFamily: 'Crimson Text, serif' }}>
                    "{data.quote}"
                  </p>
                </div>
              )}
            </div>

            {/* Questions & Answers */}
            <div className="space-y-8">
              {data.questions.map((q: any, idx: number) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.08)' }}
                >
                  {/* Question */}
                  <div className="px-8 pt-8 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mt-1" style={{ backgroundColor: '#8f1133' }}>
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-serif" style={{ color: '#6B5B73', fontFamily: 'Crimson Text, serif', fontStyle: 'italic' }}>
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="px-8 pb-8 pt-2 pl-20">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: '#3A3A3A', lineHeight: '1.8' }}>
                      {q.response.answer}
                    </p>

                    {/* Photos */}
                    {q.response.image_urls?.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {q.response.image_urls.map((url: string, imgIdx: number) => (
                          <div key={imgIdx}>
                            <img
                              src={url}
                              alt={`Memory ${imgIdx + 1}`}
                              className="w-full rounded-xl object-cover"
                              style={{ maxHeight: '300px' }}
                            />
                            {q.response.image_captions?.[imgIdx] && (
                              <p className="text-sm mt-2 text-center italic" style={{ color: '#6B5B73' }}>
                                {q.response.image_captions[imgIdx]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Decorative bottom border */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #8f1133, #FAF7F2)' }}></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* End of Story */}
        <div className="text-center py-16">
          <div className="w-16 h-px mx-auto mb-8" style={{ backgroundColor: '#E5D5D8' }}></div>
          <Heart className="h-8 w-8 mx-auto mb-6" style={{ color: '#8f1133' }} />
          <h3 className="text-3xl font-serif font-bold mb-4" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Thank you for reading
          </h3>
          <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: '#6B5B73' }}>
            These stories are a precious gift. Share yours with the people you love.
          </p>
          <button
            onClick={() => window.location.href = 'https://www.beforeigo.app'}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: '#8f1133' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
          >
            <span>Create Your Own Story</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
