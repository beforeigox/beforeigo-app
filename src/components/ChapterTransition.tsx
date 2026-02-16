import { ArrowRight } from 'lucide-react';

interface ChapterTransitionProps {
  isOpen: boolean;
  chapterName: string;
  chapterQuote: string;
  chapterNumber: number;
  onContinue: () => void;
}

export function ChapterTransition({
  isOpen,
  chapterName,
  chapterQuote,
  chapterNumber,
  onContinue
}: ChapterTransitionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cream-100 via-rose-50 to-cream-100 flex items-center justify-center z-50 p-6 animate-fade-in">
      <div className="max-w-3xl w-full text-center animate-fade-in-slide bg-white rounded-3xl p-12 shadow-2xl border border-cream-200">
        <div className="mb-8">
          <div className="inline-block px-6 py-2 bg-burgundy-600/10 text-burgundy-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-6">
            Chapter {chapterNumber}
          </div>
          <h2 className="text-5xl font-serif font-bold text-warmGray-700 mb-8 leading-tight">
            {chapterName}
          </h2>
        </div>

        <div className="mb-12">
          <svg className="w-12 h-12 text-burgundy-500/30 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
          </svg>
          <p className="text-2xl font-body italic text-burgundy-600 leading-relaxed max-w-2xl mx-auto">
            {chapterQuote}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-burgundy-500/30"></div>
            <div className="w-2 h-2 rounded-full bg-burgundy-500/30"></div>
            <div className="w-16 h-px bg-burgundy-500/30"></div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="group inline-flex items-center gap-3 px-10 py-4 bg-burgundy-600 text-white rounded-2xl hover:bg-burgundy-700 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl"
        >
          <span>Continue</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-6 text-sm text-warmGray-500">
          Take a moment to breathe before continuing your story
        </p>
      </div>
    </div>
  );
}
