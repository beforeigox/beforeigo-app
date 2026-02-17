import React, { useState, useEffect } from 'react';
import { Download, Share2, BookOpen, FileText, Mail, Copy, Check, Image as ImageIcon, ShoppingBag, X } from 'lucide-react';
import { coverDesigns } from './BookCoverDesigns';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const HARDCOVER_STRIPE_LINK = 'https://buy.stripe.com/your-hardcover-link'; // UPDATE when live

interface Story {
  id: string;
  title: string;
  role: string;
  answered_questions: number;
  total_questions: number;
  progress: number;
  status: string;
}

export function ExportPage() {
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCoverId, setSelectedCoverId] = useState('classic-burgundy');
  const [tempSelectedCoverId, setTempSelectedCoverId] = useState('classic-burgundy');

  useEffect(() => {
    async function loadStory() {
      if (!user?.id) return;
      const { data } = await supabase
        .from('Stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setStory(data);
        // Set default cover based on role
        const role = data.role?.toLowerCase() || '';
        if (role === 'dad' || role === 'grandpa') {
          setSelectedCoverId('classic-navy');
        } else {
          setSelectedCoverId('classic-burgundy');
        }
      }
      setLoading(false);
    }
    loadStory();
  }, [user?.id]);

  const shareLink = story ? `https://app.beforeigo.app/share/${story.id}` : '';

  const getFilteredCovers = () => {
    const role = story?.role?.toLowerCase() || '';
    if (role === 'dad' || role === 'grandpa' || role === 'son') {
      return coverDesigns.filter(cover => cover.colorScheme === 'navy');
    }
    if (role === 'mom' || role === 'grandma' || role === 'daughter') {
      return coverDesigns.filter(cover => cover.colorScheme === 'burgundy');
    }
    return coverDesigns;
  };

  const filteredCovers = getFilteredCovers();
  const gridCols = filteredCovers.length > 6 ? 'grid-cols-4' : 'grid-cols-3';

  const handleReadStory = () => {
    if (story) window.location.href = `/share/${story.id}`;
  };

  const handleOrderBook = () => {
    if (story && story.progress < 100) {
      const confirmed = window.confirm(
        `Your story is only ${story.progress}% complete.\n\nWe recommend completing your story before ordering.\n\nWould you like to order anyway?`
      );
      if (!confirmed) return;
    }
    window.location.href = HARDCOVER_STRIPE_LINK;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      alert(`🔗 Share this link:\n\n${shareLink}`);
    }
  };

  const handleSendEmail = () => {
    if (!emailAddresses.trim()) {
      alert('Please enter at least one email address.');
      return;
    }
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setShowEmailModal(false);
      setEmailAddresses('');
    }, 2000);
  };

  const handleSaveCover = async () => {
    setSelectedCoverId(tempSelectedCoverId);
    setShowCoverModal(false);
    if (story) {
      await supabase
        .from('Stories')
        .update({ cover_design_id: tempSelectedCoverId, updated_at: new Date().toISOString() })
        .eq('id', story.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8f1133' }}></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4" style={{ color: '#8f1133' }} />
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A' }}>No Story Yet</h2>
          <p style={{ color: '#6B5B73' }}>Start your story from the dashboard!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Share Your Legacy
          </h1>
          <p className="text-lg" style={{ color: '#6B5B73' }}>
            Your story is ready to share with your loved ones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <div>
            <div className="bg-white rounded-2xl p-10 sticky top-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#3A3A3A' }}>
                {story.title}
              </h2>

              <div className="aspect-[3/4] bg-white rounded-xl relative overflow-hidden mb-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.2)' }}>
                {(() => {
                  const selectedCover = coverDesigns.find(c => c.id === selectedCoverId);
                  const CoverComponent = selectedCover?.component;
                  return CoverComponent ? (
                    <CoverComponent
                      title={user?.full_name || 'Your Story'}
                      subtitle="A Personal Journey"
                      role={story.role || 'Mom'}
                    />
                  ) : null;
                })()}
              </div>

              <button
                onClick={() => { setTempSelectedCoverId(selectedCoverId); setShowCoverModal(true); }}
                className="w-full mb-8 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 border-2"
                style={{ borderColor: '#8f1133', color: '#8f1133', backgroundColor: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5E6EA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <ImageIcon className="h-5 w-5" />
                <span>Change Cover</span>
              </button>

              <div className="space-y-4 mb-8 p-5 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Questions:</span>
                  <span className="font-bold text-lg" style={{ color: '#3A3A3A' }}>{story.answered_questions || 0}/{story.total_questions || 72}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Progress:</span>
                  <span className="font-bold text-lg" style={{ color: '#3A3A3A' }}>{story.progress || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Status:</span>
                  <span className="font-bold text-lg capitalize" style={{ color: '#3A3A3A' }}>{story.status}</span>
                </div>
              </div>

              <button
                onClick={handleReadStory}
                className="w-full text-white py-5 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                style={{ backgroundColor: '#8f1133' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
              >
                <BookOpen className="h-5 w-5" />
                <span>Read Story</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="grid grid-cols-2 gap-6">
              {/* Web Preview */}
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-xl" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)', minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F5E6EA' }}>
                  <Share2 className="h-10 w-10" style={{ color: '#8f1133' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Web Preview</h3>
                <p className="text-sm mb-auto" style={{ color: '#6B5B73' }}>Share with a link</p>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="w-full mt-4 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#8f1133' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </button>
              </div>

              {/* Email Family */}
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-xl" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)', minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F5E6EA' }}>
                  <Mail className="h-10 w-10" style={{ color: '#8f1133' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Email Family</h3>
                <p className="text-sm mb-auto" style={{ color: '#6B5B73' }}>Send invitations</p>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full mt-4 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#8f1133' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
                >
                  <Mail className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>

              {/* Download PDF */}
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-xl" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)', minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F5E6EA' }}>
                  <FileText className="h-10 w-10" style={{ color: '#8f1133' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Download PDF</h3>
                <p className="text-sm mb-auto" style={{ color: '#6B5B73' }}>Export formatted story</p>
                <button
                  onClick={() => alert('PDF export coming soon!')}
                  className="w-full mt-4 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#8f1133' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Order Physical Book */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 flex flex-col items-center text-center border-2 border-amber-200 transition-all hover:shadow-xl" style={{ minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#FEF3C7' }}>
                  <ShoppingBag className="h-10 w-10" style={{ color: '#D97706' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Physical Copy</h3>
                <p className="text-sm mb-auto font-semibold" style={{ color: '#92400E' }}>Premium Hardcover • $53</p>
                <button
                  onClick={handleOrderBook}
                  className="w-full mt-4 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                  style={{ background: 'linear-gradient(to right, #D97706, #B45309)' }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order Book</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Share Your Story</h3>
              <button onClick={() => setShowLinkModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6B5B73' }}>Anyone with this link can read your story</p>
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 mb-4">
              <p className="text-sm font-mono break-all" style={{ color: '#3A3A3A' }}>{shareLink}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
              style={{ backgroundColor: linkCopied ? '#10B981' : '#8f1133' }}
            >
              {linkCopied ? <><Check className="h-5 w-5" /><span>Copied!</span></> : <><Copy className="h-5 w-5" /><span>Copy Link</span></>}
            </button>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Email to Family</h3>
              <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>
            <input
              type="text"
              value={emailAddresses}
              onChange={(e) => setEmailAddresses(e.target.value)}
              placeholder="mom@email.com, dad@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none mb-4"
              onFocus={(e) => e.currentTarget.style.borderColor = '#8f1133'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            <button
              onClick={handleSendEmail}
              className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
              style={{ backgroundColor: emailSent ? '#10B981' : '#8f1133' }}
            >
              {emailSent ? <><Check className="h-5 w-5" /><span>Sent!</span></> : <><Mail className="h-5 w-5" /><span>Send Email</span></>}
            </button>
          </div>
        </div>
      )}

      {/* Cover Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full my-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold" style={{ color: '#3A3A3A' }}>Choose Your Cover</h3>
              <button onClick={() => setShowCoverModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>
            <div className={`grid ${gridCols} gap-6 mb-8`}>
              {filteredCovers.map((cover) => {
                const CoverComponent = cover.component;
                const isSelected = tempSelectedCoverId === cover.id;
                const accentColor = cover.colorScheme === 'navy' ? '#1e3a5f' : '#8f1133';
                return (
                  <div key={cover.id} onClick={() => setTempSelectedCoverId(cover.id)} className="cursor-pointer transition-all hover:scale-105">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden relative" style={{ boxShadow: isSelected ? `0 0 0 4px ${accentColor}` : '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                      <CoverComponent title={user?.full_name || 'Your Story'} subtitle="A Personal Journey" role={story.role || 'Mom'} />
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2">
                          <Check className="h-6 w-6" style={{ color: accentColor }} />
                        </div>
                      )}
                    </div>
                    <p className="text-center mt-3 font-semibold" style={{ color: isSelected ? accentColor : '#3A3A3A' }}>{cover.name}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowCoverModal(false)} className="flex-1 py-4 px-6 rounded-xl font-bold border-2" style={{ borderColor: '#8f1133', color: '#8f1133' }}>Cancel</button>
              <button onClick={handleSaveCover} className="flex-1 text-white py-4 px-6 rounded-xl font-bold" style={{ backgroundColor: '#8f1133' }}>Save Cover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
