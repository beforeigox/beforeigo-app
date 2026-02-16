import { useState, useEffect, useRef } from 'react';
import { Question, Response, Story, StorytellerRole } from '../types';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Share2, Download, Mic, Video, Save, Lightbulb, Image as ImageIcon, X, Volume2, VolumeX, Check, ChevronDown, ChevronRight, Loader2, Pause, Play, Sparkles, CheckCircle } from 'lucide-react';
import { generateSpeech, isElevenLabsAvailable } from '../services/elevenLabsService';
import { UpgradeModal } from './UpgradeModal';
import { CompletionModal } from './CompletionModal';
import { ChapterTransition } from './ChapterTransition';
import { ProgressToast } from './ProgressToast';

interface QuestionInterfaceProps {
  story: Story;
  questions: Question[];
  onBack: () => void;
}

const getRoleLabel = (role: StorytellerRole): string => {
  const roleLabels: Record<StorytellerRole, string> = {
    'mom': 'Mom',
    'dad': 'Dad',
    'son': 'Son',
    'daughter': 'Daughter',
    'grandma': 'Grandma',
    'grandpa': 'Grandpa',
    'aunt_uncle': 'Aunt/Uncle',
    'sibling': 'Sibling'
  };
  return roleLabels[role];
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const getPlaceholderText = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes('full name') || q.includes('what is your name')) {
    return 'Share your name and any nicknames or preferred names...';
  }
  if (q.includes('where') && (q.includes('born') || q.includes('birth'))) {
    return 'Include the city, hospital, or any details you remember about your birthplace...';
  }
  if (q.includes('when') && q.includes('born')) {
    return 'Share your birth date and any stories about the day you were born...';
  }
  if (q.includes('childhood home') || q.includes('house you grew up')) {
    return 'Describe the rooms, the neighborhood, specific details that made it special...';
  }
  if (q.includes('earliest memory')) {
    return 'What do you remember? The sights, sounds, feelings, people who were there...';
  }
  if (q.includes('favorite') && (q.includes('memory') || q.includes('moment'))) {
    return 'Paint a picture with your words—what made this moment so special?';
  }
  if (q.includes('parents') || q.includes('mother') || q.includes('father')) {
    return 'Share what you remember about them—their personality, habits, what made them unique...';
  }
  if (q.includes('school') || q.includes('education')) {
    return 'Tell us about your teachers, friends, favorite subjects, memorable moments...';
  }
  if (q.includes('met') && (q.includes('spouse') || q.includes('partner') || q.includes('husband') || q.includes('wife'))) {
    return 'Where were you? What attracted you to them? What do you remember about that first meeting?';
  }
  if (q.includes('wedding') || q.includes('married')) {
    return 'Describe the day—the location, who was there, special moments, how you felt...';
  }
  if (q.includes('became') && (q.includes('mother') || q.includes('father') || q.includes('parent'))) {
    return 'Share your feelings, the experience, what you remember about that life-changing moment...';
  }
  if (q.includes('career') || q.includes('job') || q.includes('work')) {
    return 'What did you do? What did you enjoy or find challenging? Memorable colleagues or projects?';
  }
  if (q.includes('proudest') || q.includes('achievement')) {
    return 'What did you accomplish? Why was it meaningful? How did it make you feel?';
  }
  if (q.includes('lesson') || q.includes('advice') || q.includes('wisdom')) {
    return 'Share the insights you\'ve gained—what you wish you\'d known earlier, guidance for others...';
  }
  if (q.includes('challenge') || q.includes('difficult') || q.includes('overcome')) {
    return 'What happened? How did you get through it? What did you learn?';
  }
  if (q.includes('hobby') || q.includes('passion') || q.includes('enjoy doing')) {
    return 'What draws you to this? When did you start? What do you love about it?';
  }
  if (q.includes('tradition') || q.includes('celebrate')) {
    return 'Describe how you celebrate—the activities, foods, people, what makes it special...';
  }
  if (q.includes('relationship') && q.includes('child')) {
    return 'Share your feelings, special moments, what you hope for them, what makes them unique...';
  }
  if (q.includes('want') && (q.includes('know') || q.includes('remember'))) {
    return 'This is your chance to share what matters most—speak from your heart...';
  }
  if (q.includes('describe yourself') || q.includes('who are you')) {
    return 'How would you describe your personality, values, what makes you who you are?';
  }

  return 'Take your time... write as if you\'re speaking to someone you love. Your words will become treasured memories.';
};

export default function QuestionInterface({ story, questions, onBack }: QuestionInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, Response>>(new Map());
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [showCategoryQuote, setShowCategoryQuote] = useState(false);
  const [previousCategory, setPreviousCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingTime, setVoiceRecordingTime] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const voiceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceChunksRef = useRef<Blob[]>([]);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoRecordingTime, setVideoRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const videoMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const [permissionError, setPermissionError] = useState<string | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<'audio' | 'video'>('audio');
  const [userPlan, setUserPlan] = useState<'storyteller' | 'keepsake' | 'legacy'>('storyteller');

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showChapterTransition, setShowChapterTransition] = useState(false);
  const [transitionChapter, setTransitionChapter] = useState({ name: '', quote: '', number: 1 });
  const [showProgressToast, setShowProgressToast] = useState(false);
  const [progressMilestone, setProgressMilestone] = useState({ percent: 0, message: '' });
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());

  const questionMediaRef = useRef<Map<string, {
    voiceBlob?: Blob;
    voiceUrl?: string;
    voiceDuration?: number;
    videoBlob?: Blob;
    videoUrl?: string;
    videoDuration?: number;
  }>>(new Map());

  useEffect(() => {
    if (showVideoRecorder && videoStreamRef.current && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = videoStreamRef.current;
    }
  }, [showVideoRecorder]);

  const hasPremiumAccess = () => {
    return userPlan === 'keepsake' || userPlan === 'legacy';
  };

  const handleAudioRecordingClick = () => {
    if (hasPremiumAccess()) {
      startVoiceRecording();
    } else {
      setUpgradeFeature('audio');
      setShowUpgradeModal(true);
    }
  };

  const handleVideoRecordingClick = () => {
    if (hasPremiumAccess()) {
      startVideoRecording();
    } else {
      setUpgradeFeature('video');
      setShowUpgradeModal(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center paper-texture">
          <div className="w-16 h-16 bg-burgundy-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-burgundy-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-warmGray-700 mb-2">No Questions Available</h2>
          <p className="text-warmGray-600 mb-6">
            We couldn't load questions for the selected role. Please try again or select a different role.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center paper-texture">
          <div className="w-16 h-16 bg-burgundy-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-burgundy-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-warmGray-700 mb-2">Loading...</h2>
          <p className="text-warmGray-600">Please wait while we load your questions.</p>
        </div>
      </div>
    );
  }

  const groupedQuestions = questions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = [];
    }
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  useEffect(() => {
    loadResponses();
  }, [story.id]);

  useEffect(() => {
    const loadUserPlan = async () => {
      const { data } = await supabase
        .from('stories')
        .select('plan')
        .eq('id', story.id)
        .single();

      if (data?.plan) {
        setUserPlan(data.plan as 'storyteller' | 'keepsake' | 'legacy');
      }
    };
    loadUserPlan();
  }, [story.id]);

  useEffect(() => {
    return () => {
      stopAudio();
      cleanupVoiceRecording();
      cleanupVideoRecording();
    };
  }, []);

  useEffect(() => {
    if (currentQuestion) {
      const response = responses.get(currentQuestion.id);
      setCurrentAnswer(response?.answer || '');
      setCurrentImages(response?.image_urls || []);
      stopAudio();

      const savedMedia = questionMediaRef.current.get(currentQuestion.id);
      if (savedMedia) {
        if (savedMedia.voiceBlob && savedMedia.voiceUrl) {
          setVoiceBlob(savedMedia.voiceBlob);
          setVoicePreviewUrl(savedMedia.voiceUrl);
          setVoiceRecordingTime(savedMedia.voiceDuration || 0);
        } else {
          setVoiceBlob(null);
          setVoicePreviewUrl(null);
          setVoiceRecordingTime(0);
        }

        if (savedMedia.videoBlob && savedMedia.videoUrl) {
          setVideoBlob(savedMedia.videoBlob);
          setVideoPreviewUrl(savedMedia.videoUrl);
          setVideoRecordingTime(savedMedia.videoDuration || 0);
        } else {
          setVideoBlob(null);
          setVideoPreviewUrl(null);
          setVideoRecordingTime(0);
        }
      } else {
        setVoiceBlob(null);
        setVoicePreviewUrl(null);
        setVoiceRecordingTime(0);
        setVideoBlob(null);
        setVideoPreviewUrl(null);
        setVideoRecordingTime(0);
      }

      if (previousCategory !== currentQuestion.category) {
        setShowCategoryQuote(true);
        setPreviousCategory(currentQuestion.category);
      }

      setExpandedCategories(prev => {
        const newSet = new Set(prev);
        newSet.add(currentQuestion.category);
        return newSet;
      });
	// Scroll active question into view
      setTimeout(() => {
        const activeButton = document.querySelector('.bg-burgundy-600.text-white.shadow-md');
        if (activeButton) {
          activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }, [currentQuestionIndex, responses, currentQuestion]);
    
  useEffect(() => {
    if (currentAnswer.trim().length > 0 && showCategoryQuote) {
      setShowCategoryQuote(false);
    }
  }, [currentAnswer]);

  const loadResponses = async () => {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('story_id', story.id);

  if (!error && data) {
    const responseMap = new Map<string, Response>();
    data.forEach((r: Response) => {
      responseMap.set(r.question_id, r);
    });
    setResponses(responseMap);
    
    // Jump to first unanswered question
    const firstUnanswered = questions.findIndex(q => {
      const response = responseMap.get(q.id);
      return !response?.is_completed;
    });
    
    if (firstUnanswered !== -1) {
      setCurrentQuestionIndex(firstUnanswered);
    }
  }
};

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCurrentImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const cleanupVoiceRecording = () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state !== 'inactive') {
      voiceMediaRecorderRef.current.stop();
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach(track => track.stop());
      voiceStreamRef.current = null;
    }
  };

  const cleanupVideoRecording = () => {
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
    if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state !== 'inactive') {
      videoMediaRecorderRef.current.stop();
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
  };

  const startVoiceRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4',
        'audio/mpeg'
      ];

      let selectedMimeType = 'audio/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000
      });
      voiceMediaRecorderRef.current = mediaRecorder;
      voiceChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          voiceChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(voiceChunksRef.current, { type: selectedMimeType });
        setVoiceBlob(blob);
        const url = URL.createObjectURL(blob);
        setVoicePreviewUrl(url);

        if (voiceTimerRef.current) {
          clearInterval(voiceTimerRef.current);
          voiceTimerRef.current = null;
        }

        if (voiceStreamRef.current) {
          voiceStreamRef.current.getTracks().forEach(track => track.stop());
          voiceStreamRef.current = null;
        }
      };

      mediaRecorder.start(1000);
      setIsRecordingVoice(true);
      setShowVoiceRecorder(true);
      setVoiceRecordingTime(0);

      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionError('Unable to access microphone. Please grant permission and try again.');
      setShowVoiceRecorder(false);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceMediaRecorderRef.current && voiceMediaRecorderRef.current.state !== 'inactive') {
      voiceMediaRecorderRef.current.stop();
    }
    setIsRecordingVoice(false);
  };

  const saveVoiceRecording = () => {
    if (currentQuestion && voiceBlob && voicePreviewUrl) {
      const existingMedia = questionMediaRef.current.get(currentQuestion.id) || {};
      questionMediaRef.current.set(currentQuestion.id, {
        ...existingMedia,
        voiceBlob,
        voiceUrl: voicePreviewUrl,
        voiceDuration: voiceRecordingTime
      });
    }
    setShowVoiceRecorder(false);
  };

  const reRecordVoice = () => {
    if (voicePreviewUrl) {
      URL.revokeObjectURL(voicePreviewUrl);
    }
    setVoiceBlob(null);
    setVoicePreviewUrl(null);
    setVoiceRecordingTime(0);
    voiceChunksRef.current = [];
    startVoiceRecording();
  };

  const cancelVoiceRecording = () => {
    cleanupVoiceRecording();
    if (voicePreviewUrl) {
      URL.revokeObjectURL(voicePreviewUrl);
    }
    setShowVoiceRecorder(false);
    setIsRecordingVoice(false);
    setVoiceBlob(null);
    setVoicePreviewUrl(null);
    setVoiceRecordingTime(0);
    voiceChunksRef.current = [];
  };

  const startVideoRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      videoStreamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];

      let selectedMimeType = 'video/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000
      });
      videoMediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: selectedMimeType });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoPreviewUrl(url);

        if (videoTimerRef.current) {
          clearInterval(videoTimerRef.current);
          videoTimerRef.current = null;
        }

        if (videoStreamRef.current) {
          videoStreamRef.current.getTracks().forEach(track => track.stop());
          videoStreamRef.current = null;
        }

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      mediaRecorder.start(1000);
      setIsRecordingVideo(true);
      setShowVideoRecorder(true);
      setVideoRecordingTime(0);

      videoTimerRef.current = setInterval(() => {
        setVideoRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionError('Unable to access camera and microphone. Please grant permission and try again.');
      setShowVideoRecorder(false);
    }
  };

  const stopVideoRecording = () => {
    if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state !== 'inactive') {
      videoMediaRecorderRef.current.stop();
    }
    setIsRecordingVideo(false);
  };

  const saveVideoRecording = () => {
    if (currentQuestion && videoBlob && videoPreviewUrl) {
      const existingMedia = questionMediaRef.current.get(currentQuestion.id) || {};
      questionMediaRef.current.set(currentQuestion.id, {
        ...existingMedia,
        videoBlob,
        videoUrl: videoPreviewUrl,
        videoDuration: videoRecordingTime
      });
    }
    setShowVideoRecorder(false);
  };

  const reRecordVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoBlob(null);
    setVideoPreviewUrl(null);
    setVideoRecordingTime(0);
    videoChunksRef.current = [];
    startVideoRecording();
  };

  const cancelVideoRecording = () => {
    cleanupVideoRecording();
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setShowVideoRecorder(false);
    setIsRecordingVideo(false);
    setVideoBlob(null);
    setVideoPreviewUrl(null);
    setVideoRecordingTime(0);
    videoChunksRef.current = [];
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const fallbackToSpeechSynthesis = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.lang === 'en-US' &&
        !voice.name.toLowerCase().includes('male')
      ) || voices.find(voice => voice.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeech = async () => {
    if (isSpeaking) {
      stopAudio();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (!currentQuestion) return;

    if (!isElevenLabsAvailable()) {
      fallbackToSpeechSynthesis(currentQuestion.question);
      return;
    }

    setIsGeneratingAudio(true);

    try {
      const audioUrl = await generateSpeech(currentQuestion.question);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsGeneratingAudio(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setIsGeneratingAudio(false);
        audioRef.current = null;
        fallbackToSpeechSynthesis(currentQuestion.question);
      };

      await audio.play();
    } catch (error) {
      console.error('ElevenLabs error:', error);
      setIsGeneratingAudio(false);
      fallbackToSpeechSynthesis(currentQuestion.question);
    }
  };

 const saveDraft = async () => {
  if (!currentQuestion) return;
  
  try {
    const existingResponse = responses.get(currentQuestion.id);
    
    if (existingResponse) {
      await supabase.from('responses').update({
        answer: currentAnswer,
        image_urls: currentImages,
        is_completed: false,
        updated_at: new Date().toISOString()
      }).eq('id', existingResponse.id);
    } else if (currentAnswer.trim().length > 0) {
      await supabase.from('responses').insert({
        story_id: story.id,
        question_id: currentQuestion.id,
        answer: currentAnswer,
        image_urls: currentImages,
        is_completed: false
      });
    }
    
    await loadResponses();
  } catch (error) {
    console.error('Draft save failed:', error);
  }
};
      
      const newCompletedCount = completedCount + (isCompleted && !existingResponse?.is_completed ? 1 : 0);
      checkMilestone(newCompletedCount);

      if (isLastQuestion && isCompleted) {
        await supabase
          .from('stories')
          .update({
            status: 'complete',
            completion_date: new Date().toISOString(),
            progress: 100
          })
          .eq('id', story.id);

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setShowCompletionModal(true);
        }, 750);
      } else {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          if (currentQuestionIndex < questions.length - 1) {
            const nextQuestion = questions[currentQuestionIndex + 1];
            if (nextQuestion.category !== currentQuestion.category) {
              setTransitionChapter({
                name: nextQuestion.category,
                quote: nextQuestion.categoryQuote || '',
                number: getChapterNumber(nextQuestion.category)
              });
              setShowChapterTransition(true);
            } else {
              goToNext();
            }
          }
        }, 750);
      }
    } finally {
      setSaving(false);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const completedCount = Array.from(responses.values()).filter(r => r.is_completed).length;
  const progressPercentage = (completedCount / totalQuestions) * 100;
  const questionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const currentCategoryQuote = currentQuestion.categoryQuote;

  const checkMilestone = (newCompletedCount: number) => {
    const newPercentage = Math.round((newCompletedCount / totalQuestions) * 100);

    const milestones = [
      { percent: 25, message: "You're doing great! Keep preserving these precious memories." },
      { percent: 50, message: "Halfway there! These memories are priceless." },
      { percent: 75, message: "Almost there! Your story is taking shape beautifully." },
      { percent: 90, message: "You're so close! Just a few more questions left." }
    ];

    for (const milestone of milestones) {
      if (newPercentage >= milestone.percent && !shownMilestones.has(milestone.percent)) {
        setProgressMilestone(milestone);
        setShowProgressToast(true);
        setShownMilestones(prev => new Set([...prev, milestone.percent]));
        break;
      }
    }
  };

  const getChapterNumber = (category: string): number => {
    const categories = Object.keys(groupedQuestions);
    return categories.indexOf(category) + 1;
  };

  const getTotalImagesAdded = (): number => {
    return Array.from(responses.values()).reduce((total, response) => {
      return total + (response.image_urls?.length || 0);
    }, 0);
  };

  const getTotalAudioRecordings = (): number => {
    return questionMediaRef.current.size;
  };

  return (
    <div className="min-h-screen bg-cream-100 relative">
      {showToast && (
        <div className="fixed top-8 right-8 bg-burgundy-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Save className="w-4 h-4" />
          </div>
          <span className="font-medium">Your story has been saved</span>
        </div>
      )}

      <div className="bg-white border-b border-cream-300 paper-texture sticky top-0 z-40">
        <div className="h-2 bg-cream-200 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-burgundy-600 to-burgundy-600 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse-soft"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-cream-100 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-warmGray-600" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-burgundy-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-semibold text-warmGray-700 leading-tight">Your Life Story</h1>
                  <p className="text-sm text-warmGray-500 mt-0.5">
                    {getRoleLabel(story.storyteller_role)} • Question {questionNumber} of {totalQuestions} • {Math.round(progressPercentage)}% complete
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-cream-100 rounded-xl transition-all">
                <Share2 className="w-5 h-5 text-warmGray-600" />
              </button>
              <button className="p-2.5 hover:bg-cream-100 rounded-xl transition-all">
                <Download className="w-5 h-5 text-warmGray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-10">
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-2xl shadow-sm border border-cream-300 p-8 paper-texture overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 80px)' }}>
              <h2 className="text-lg font-serif font-semibold text-warmGray-700 mb-8 uppercase tracking-wider text-center">
                Life's Chapters
              </h2>
              <div className="space-y-2">
                {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => {
                  const isExpanded = expandedCategories.has(category);
                  const categoryCompletedCount = categoryQuestions.filter(q => responses.get(q.id)?.is_completed).length;
                  const categoryTotalCount = categoryQuestions.length;
                  const hasCurrentQuestion = categoryQuestions.some(q => questions.indexOf(q) === currentQuestionIndex);

                  return (
                    <div key={category} className="border-b border-cream-200 last:border-b-0 pb-3 last:pb-0">
                      <button
                        onClick={() => toggleCategory(category)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-cream-50 group ${
                          hasCurrentQuestion ? 'bg-burgundy-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : ''}`}>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-burgundy-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-warmGray-500" />
                            )}
                          </div>
                          <div className="text-left flex-1">
                            <h3 className={`font-serif font-semibold text-sm leading-snug ${
                              hasCurrentQuestion ? 'text-burgundy-600' : 'text-warmGray-700'
                            }`}>
                              {category}
                            </h3>
                            <p className="text-xs text-warmGray-500 mt-0.5">
                              {categoryCompletedCount} of {categoryTotalCount}
                            </p>
                          </div>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="space-y-1 mt-2 ml-4">
                          {categoryQuestions.map((q) => {
                            const globalIndex = questions.indexOf(q);
                            const isActive = globalIndex === currentQuestionIndex;
                            const isCompleted = responses.get(q.id)?.is_completed;

                            return (
                              <button
                                key={q.id}
                                onClick={() => goToQuestion(globalIndex)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 group ${
                                  isActive
                                    ? 'bg-burgundy-600 text-white shadow-md'
                                    : isCompleted
                                    ? 'text-warmGray-600 hover:bg-cream-100'
                                    : 'text-warmGray-500 hover:bg-cream-100'
                                }`}
                              >
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                  isCompleted
                                    ? isActive
                                      ? 'bg-white/25'
                                      : 'bg-green-500'
                                    : isActive
                                    ? 'bg-white/25'
                                    : 'bg-cream-200'
                                }`}>
                                  {isCompleted && (
                                    <Check className={`w-3 h-3 ${isActive ? 'text-white' : 'text-white'}`} />
                                  )}
                                </div>
                                <span className={`text-xs leading-relaxed line-clamp-2 ${
                                  isActive ? 'font-semibold' : isCompleted ? 'font-medium' : ''
                                }`}>
                                  {truncateText(q.question, 45)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="flex-1 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-cream-300 p-8 mb-6 paper-texture">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-block px-5 py-1.5 bg-burgundy-50 text-burgundy-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                </div>

                {showCategoryQuote && currentCategoryQuote && (
                  <div className="mb-6 text-center animate-fade-in-slide">
                    <svg className="w-8 h-8 text-burgundy-600/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                    </svg>
                    <p className="font-body italic text-burgundy-600 text-base leading-relaxed max-w-2xl mx-auto">
                      {currentCategoryQuote}
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <div className="w-12 h-px bg-burgundy-600/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-burgundy-600/30"></div>
                      <div className="w-12 h-px bg-burgundy-600/30"></div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <h2 className="font-serif text-[2rem] text-warmGray-700 leading-[1.4] flex-1">
                    {currentQuestion.question}
                  </h2>
                  <button
                    onClick={toggleSpeech}
                    disabled={isGeneratingAudio}
                    className={`p-3 rounded-xl transition-all flex-shrink-0 shadow-sm ${
                      isGeneratingAudio
                        ? 'bg-cream-200 text-warmGray-400 cursor-wait'
                        : isSpeaking
                        ? 'bg-burgundy-600 text-white animate-pulse-soft'
                        : 'text-warmGray-600 bg-cream-100 hover:bg-cream-200'
                    }`}
                    title={isGeneratingAudio ? 'Generating audio...' : isSpeaking ? 'Stop reading' : 'Listen to question'}
                  >
                    {isGeneratingAudio ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isSpeaking ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
		onBlur={saveDraft}
                placeholder={currentQuestion.placeholder || getPlaceholderText(currentQuestion.question)}
                className="w-full h-[220px] p-6 border-2 border-cream-300 rounded-2xl focus:border-burgundy-600 focus:outline-none focus:ring-4 focus:ring-burgundy-600/10 resize-y text-warmGray-700 placeholder:text-warmGray-400 placeholder:italic leading-[1.7] font-body transition-all shadow-inner"
                style={{ fontSize: '1.0625rem' }}
              />

              {currentImages.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {currentImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Memory ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded-xl border-2 border-cream-300 shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-burgundy-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {permissionError && (
               <div className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b' }}>
                  {permissionError}
                </div>
              )}

              {voiceBlob && voicePreviewUrl && !showVoiceRecorder && (
                <div className="mt-4 p-4 bg-cream-50 border border-cream-300 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-burgundy-100 rounded-xl flex items-center justify-center">
                      <Mic className="w-5 h-5 text-burgundy-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warmGray-700 mb-2">Voice Recording ({formatTime(voiceRecordingTime)})</p>
                      <audio
                        key={voicePreviewUrl}
                        controls
                        src={voicePreviewUrl}
                        preload="metadata"
                        className="w-full h-8"
                        controlsList="nodownload"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (currentQuestion) {
                          const existingMedia = questionMediaRef.current.get(currentQuestion.id);
                          if (existingMedia) {
                            const { voiceBlob: _, voiceUrl: __, voiceDuration: ___, ...rest } = existingMedia;
                            if (Object.keys(rest).length > 0) {
                              questionMediaRef.current.set(currentQuestion.id, rest);
                            } else {
                              questionMediaRef.current.delete(currentQuestion.id);
                            }
                          }
                        }
                        setVoiceBlob(null);
                        setVoicePreviewUrl(null);
                        setVoiceRecordingTime(0);
                      }}
                      className="flex-shrink-0 p-2 text-warmGray-500 hover:text-burgundy-600 hover:bg-cream-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {videoBlob && videoPreviewUrl && !showVideoRecorder && (
                <div className="mt-4 p-4 bg-cream-50 border border-cream-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-burgundy-100 rounded-xl flex items-center justify-center">
                      <Video className="w-5 h-5 text-burgundy-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-warmGray-700 mb-2">Video Recording ({formatTime(videoRecordingTime)})</p>
                      <video
                        key={videoPreviewUrl}
                        controls
                        src={videoPreviewUrl}
                        preload="metadata"
                        className="w-full rounded-lg"
                        controlsList="nodownload"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (currentQuestion) {
                          const existingMedia = questionMediaRef.current.get(currentQuestion.id);
                          if (existingMedia) {
                            const { videoBlob: _, videoUrl: __, videoDuration: ___, ...rest } = existingMedia;
                            if (Object.keys(rest).length > 0) {
                              questionMediaRef.current.set(currentQuestion.id, rest);
                            } else {
                              questionMediaRef.current.delete(currentQuestion.id);
                            }
                          }
                        }
                        setVideoBlob(null);
                        setVideoPreviewUrl(null);
                        setVideoRecordingTime(0);
                      }}
                      className="flex-shrink-0 p-2 text-warmGray-500 hover:text-burgundy-600 hover:bg-cream-100 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleAudioRecordingClick}
                  className="relative flex items-center gap-2 px-5 py-2.5 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all group"
                  title={!hasPremiumAccess() ? "Upgrade to Keepsake or Legacy to save audio recordings" : "Record audio"}
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">Record audio</span>
                  {!hasPremiumAccess() && (
                    <Sparkles className="w-3.5 h-3.5 text-burgundy-600" />
                  )}
                </button>
                <button
                  onClick={handleVideoRecordingClick}
                  className="relative p-2.5 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all group"
                  title={!hasPremiumAccess() ? "Upgrade to Keepsake or Legacy to save video recordings" : "Record video"}
                >
                  <Video className="w-5 h-5" />
                  {!hasPremiumAccess() && (
                    <Sparkles className="w-3 h-3 text-burgundy-600 absolute -top-0.5 -right-0.5" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/heic,video/mp4,video/quicktime,video/mov"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all"
                  title="Upload photos"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-cream-200">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2.5 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  >
                    Previous
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={goToNext}
                      disabled={currentQuestionIndex === questions.length - 1}
                      className="px-6 py-2.5 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      Next
                    </button>
                    <button
                      onClick={saveResponse}
                      disabled={saving}
                      className={`flex items-center gap-2.5 px-7 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md hover:shadow-lg font-medium ${
                        isLastQuestion
                          ? 'bg-burgundy-600 text-white hover:bg-burgundy-700 animate-pulse-glow'
                          : 'bg-burgundy-600 text-white hover:bg-burgundy-700'
                      }`}
                    >
                      {isLastQuestion ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {saving ? 'Completing your story...' : 'Complete My Story ✓'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {saving ? 'Preserving your story...' : 'Save & Continue'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-center text-sm text-warmGray-500 italic">
                  Don't worry — you can pick up where you left off anytime
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-cream-100 rounded-2xl p-6 border border-cream-300 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-burgundy-600/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-burgundy-600" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-warmGray-700 mb-3 text-lg">Gentle Reminders</h3>
                  <ul className="space-y-2 text-warmGray-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy-600 mt-1">•</span>
                      <span>Write as if you're having a conversation with someone you love</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy-600 mt-1">•</span>
                      <span>Small details bring memories to life—describe sounds, smells, feelings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy-600 mt-1">•</span>
                      <span>Your authentic voice matters more than perfect grammar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-burgundy-600 mt-1">•</span>
                      <span>Take all the time you need—this is your legacy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showVoiceRecorder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 paper-texture">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isRecordingVoice ? 'bg-burgundy-100 animate-pulse-soft' : 'bg-burgundy-100'
              }`}>
                <Mic className={`w-10 h-10 ${isRecordingVoice ? 'text-burgundy-600' : 'text-burgundy-600'}`} />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-warmGray-700 mb-2">
                {isRecordingVoice ? 'Recording...' : voicePreviewUrl ? 'Voice Recording Complete' : 'Ready to Record'}
              </h3>
              <div className="text-4xl font-mono font-bold text-burgundy-600 mb-4">
                {formatTime(voiceRecordingTime)}
              </div>
            </div>

            {isRecordingVoice && (
              <div className="mb-6 flex justify-center">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-burgundy-600 rounded-full animate-waveform"
                      style={{
                        height: `${20 + Math.random() * 30}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {voicePreviewUrl && !isRecordingVoice && (
              <div className="mb-6">
                <audio
                  key={voicePreviewUrl}
                  controls
                  src={voicePreviewUrl}
                  preload="metadata"
                  className="w-full"
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              {isRecordingVoice ? (
                <button
                  onClick={stopVoiceRecording}
                  className="px-8 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-all font-medium shadow-md"
                >
                  Stop Recording
                </button>
              ) : voicePreviewUrl ? (
                <>
                  <button
                    onClick={reRecordVoice}
                    className="px-6 py-3 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all font-medium"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={saveVoiceRecording}
                    className="px-8 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-all font-medium shadow-md"
                  >
                    Save
                  </button>
                </>
              ) : null}
            </div>

            <button
              onClick={cancelVoiceRecording}
              className="w-full mt-4 px-6 py-2.5 text-warmGray-500 hover:text-warmGray-700 hover:bg-cream-100 rounded-xl transition-all text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showVideoRecorder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 paper-texture">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-semibold text-warmGray-700 mb-2">
                {isRecordingVideo ? 'Recording Video...' : videoPreviewUrl ? 'Video Recording Complete' : 'Ready to Record'}
              </h3>
              <div className="text-3xl font-mono font-bold text-burgundy-600 mb-4">
                {formatTime(videoRecordingTime)}
              </div>
            </div>

            <div className="mb-6 bg-black rounded-xl overflow-hidden relative">
              {isRecordingVideo && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-burgundy-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  REC
                </div>
              )}
              {videoPreviewUrl && !isRecordingVideo ? (
                <video
                  key={videoPreviewUrl}
                  controls
                  src={videoPreviewUrl}
                  preload="metadata"
                  className="w-full rounded-xl"
                />
              ) : (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-xl"
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {isRecordingVideo ? (
                <button
                  onClick={stopVideoRecording}
                  className="px-8 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-all font-medium shadow-md flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-white rounded-sm" />
                  Stop Recording
                </button>
              ) : videoPreviewUrl ? (
                <>
                  <button
                    onClick={reRecordVideo}
                    className="px-6 py-3 text-warmGray-600 hover:bg-cream-100 rounded-xl transition-all font-medium"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={saveVideoRecording}
                    className="px-8 py-3 bg-burgundy-600 text-white rounded-xl hover:bg-burgundy-700 transition-all font-medium shadow-md"
                  >
                    Save
                  </button>
                </>
              ) : null}
            </div>

            <button
              onClick={cancelVideoRecording}
              className="w-full mt-4 px-6 py-2.5 text-warmGray-500 hover:text-warmGray-700 hover:bg-cream-100 rounded-xl transition-all text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        currentPlan={userPlan}
        storyId={story.id}
        onPlanUpdated={() => {
          setUserPlan('legacy');
        }}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        role={getRoleLabel(story.storyteller_role)}
        completedQuestions={totalQuestions}
        totalQuestions={totalQuestions}
        imagesAdded={getTotalImagesAdded()}
        audioRecordings={getTotalAudioRecordings()}
        onViewStory={() => {
          window.location.href = '/';
        }}
      />

      <ChapterTransition
        isOpen={showChapterTransition}
        chapterName={transitionChapter.name}
        chapterQuote={transitionChapter.quote}
        chapterNumber={transitionChapter.number}
        onContinue={() => {
          setShowChapterTransition(false);
          goToNext();
        }}
      />

      <ProgressToast
        isVisible={showProgressToast}
        milestone={progressMilestone.percent}
        message={progressMilestone.message}
        onClose={() => setShowProgressToast(false)}
      />
    </div>
  );
}
