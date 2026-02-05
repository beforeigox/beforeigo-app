import React, { useState, useEffect } from 'react';
import { Download, Share2, BookOpen, FileText, Mail, Copy, Check, Image as ImageIcon, ShoppingBag, X } from 'lucide-react';
import { mockProjects } from '../../utils/mockData';
import { coverDesigns } from './BookCoverDesigns';
import { supabase } from '../../lib/supabase';

export function ExportPage() {
  const currentProject = mockProjects[0];
  const [shareLink] = useState('https://beforeigo.com/share/sarah-life-story-abc123');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [selectedCoverId, setSelectedCoverId] = useState('classic-burgundy');
  const [tempSelectedCoverId, setTempSelectedCoverId] = useState('classic-burgundy');

  // Filter covers based on role
  const getFilteredCovers = () => {
    const role = currentProject.role?.toLowerCase() || '';

    // Masculine roles - show only navy covers
    if (role === 'dad' || role === 'grandpa' || role === 'son') {
      return coverDesigns.filter(cover => cover.colorScheme === 'navy');
    }

    // Feminine roles - show only burgundy covers
    if (role === 'mom' || role === 'grandma' || role === 'daughter') {
      return coverDesigns.filter(cover => cover.colorScheme === 'burgundy');
    }

    // Neutral roles - show all covers
    return coverDesigns;
  };

  const filteredCovers = getFilteredCovers();
  const gridCols = filteredCovers.length > 6 ? 'grid-cols-4' : 'grid-cols-3';

  const handleReadStory = () => {
    alert('📖 Opening your complete story...\n\nThis would show a beautiful reading interface with:\n• Chapter navigation\n• All your responses formatted beautifully\n• Photos and memories inline\n• Print-friendly layout');
  };

  useEffect(() => {
    const loadCoverDesign = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user && currentProject.id) {
        const { data, error } = await supabase
          .from('stories')
          .select('cover_design_id')
          .eq('id', currentProject.id)
          .maybeSingle();

        if (data && !error) {
          const defaultCover = getDefaultCover();
          setSelectedCoverId(data.cover_design_id || defaultCover);
        } else {
          setSelectedCoverId(getDefaultCover());
        }
      } else {
        setSelectedCoverId(getDefaultCover());
      }
    };

    loadCoverDesign();
  }, [currentProject.id]);

  const getDefaultCover = () => {
    const role = currentProject.role?.toLowerCase() || '';
    if (role === 'dad' || role === 'grandpa' || role === 'son') {
      return 'classic-navy';
    }
    return 'classic-burgundy';
  };

  const handleChangeCover = () => {
    setTempSelectedCoverId(selectedCoverId);
    setShowCoverModal(true);
  };

  const handleSaveCover = async () => {
    setSelectedCoverId(tempSelectedCoverId);
    setShowCoverModal(false);

    const { data: { user } } = await supabase.auth.getUser();

    if (user && currentProject.id) {
      await supabase
        .from('stories')
        .update({
          cover_design_id: tempSelectedCoverId,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProject.id)
        .eq('user_id', user.id);
    }
  };

  const handleOpenLinkModal = () => {
    setShowLinkModal(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      alert(`🔗 Link copied:\n\n${shareLink}\n\nShare this link with your family!`);
    }
  };

  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
  };

  const handleSendEmail = () => {
    if (!emailAddresses.trim()) {
      alert('Please enter at least one email address.');
      return;
    }

    const emails = emailAddresses.split(',').map(e => e.trim()).filter(e => e);

    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);

    setTimeout(() => {
      alert(`✅ Invitations sent successfully!\n\nSent to: ${emails.join(', ')}\n\nThey'll receive a beautiful email with a link to read your story.`);
      setShowEmailModal(false);
    }, 500);

    setEmailAddresses('');
  };

  const handleDownloadPDF = () => {
    alert('📄 Generating PDF...\n\nThis would:\n• Generate a beautifully formatted PDF\n• Include all your stories and photos\n• Start the download automatically\n\nYour story will be ready to save, print, or share.');
  };

  const handleOrderBook = () => {
    alert('📚 Ordering Premium Hardcover Book - $79\n\nThis would redirect to Stripe checkout for:\n• Museum-quality linen cover\n• Archival paper (lasts 100+ years)\n• Photo-quality printing\n• Professional binding\n• Custom cover design\n\nYour beautiful hardbound book will be shipped to you!');
  };

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
          {/* LEFT SIDE - Story Preview (50%) */}
          <div>
            <div className="bg-white rounded-2xl p-10 sticky top-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}>
              <h2 className="text-3xl font-bold mb-8" style={{ color: '#3A3A3A' }}>
                {currentProject.role}'s Life Story
              </h2>

              {/* Cover Image */}
              <div className="aspect-[3/4] bg-white rounded-xl relative overflow-hidden mb-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.2)' }}>
                {(() => {
                  const selectedCover = coverDesigns.find(c => c.id === selectedCoverId);
                  const CoverComponent = selectedCover?.component;
                  return CoverComponent ? (
                    <CoverComponent
                      title={currentProject.storytellerName || 'Sarah'}
                      subtitle="A Personal Journey"
                      role={currentProject.role || 'Mom'}
                    />
                  ) : null;
                })()}
              </div>

              {/* Change Cover Button */}
              <button
                onClick={handleChangeCover}
                className="w-full mb-8 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 border-2"
                style={{ borderColor: '#8f1133', color: '#8f1133', backgroundColor: 'white' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5E6EA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <ImageIcon className="h-5 w-5" />
                <span>Change Cover</span>
              </button>

              {/* Stats */}
              <div className="space-y-4 mb-8 p-5 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Questions:</span>
                  <span className="font-bold text-lg" style={{ color: '#3A3A3A' }}>{currentProject.answeredQuestions}/72</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Photos:</span>
                  <span className="font-bold text-lg" style={{ color: '#3A3A3A' }}>43</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium" style={{ color: '#6B5B73' }}>Chapters:</span>
                  <span className="font-bold text-lg" style={{ color: '#3A3A3A' }}>12</span>
                </div>
              </div>

              {/* Read Story Button */}
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

          {/* RIGHT SIDE - Export Options (50%) - 2x2 Grid */}
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
                  onClick={handleOpenLinkModal}
                  className="w-full mt-4 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#8f1133' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </button>
              </div>

              {/* Email to Family */}
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:shadow-xl" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)', minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F5E6EA' }}>
                  <Mail className="h-10 w-10" style={{ color: '#8f1133' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Email Family</h3>
                <p className="text-sm mb-auto" style={{ color: '#6B5B73' }}>Send invitations</p>
                <button
                  onClick={handleOpenEmailModal}
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
                  onClick={handleDownloadPDF}
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
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 flex flex-col items-center text-center border-2 border-amber-200 transition-all hover:shadow-xl" style={{ boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.2)', minHeight: '280px' }}>
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#FEF3C7' }}>
                  <ShoppingBag className="h-10 w-10" style={{ color: '#D97706' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Physical Copy</h3>
                <p className="text-sm mb-auto font-semibold" style={{ color: '#92400E' }}>Premium • $79</p>
                <button
                  onClick={handleOrderBook}
                  className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white py-3 px-4 rounded-xl font-bold transition-all hover:from-amber-700 hover:to-orange-800 flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Share Your Story</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm" style={{ color: '#6B5B73' }}>
                Anyone with this link can read your story
              </p>

              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <p className="text-sm font-mono break-all" style={{ color: '#3A3A3A' }}>
                  {shareLink}
                </p>
              </div>

              <button
                onClick={handleCopyLink}
                className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                style={{ backgroundColor: linkCopied ? '#10B981' : '#8f1133' }}
                onMouseEnter={(e) => !linkCopied && (e.currentTarget.style.backgroundColor = '#7a0e2b')}
                onMouseLeave={(e) => !linkCopied && (e.currentTarget.style.backgroundColor = '#8f1133')}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: '#3A3A3A' }}>Email to Family</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#3A3A3A' }}>
                  Email addresses (comma-separated)
                </label>
                <input
                  type="text"
                  value={emailAddresses}
                  onChange={(e) => setEmailAddresses(e.target.value)}
                  placeholder="mom@email.com, dad@email.com, sister@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors"
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8f1133'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                onClick={handleSendEmail}
                className="w-full text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                style={{ backgroundColor: emailSent ? '#10B981' : '#8f1133' }}
                onMouseEnter={(e) => !emailSent && (e.currentTarget.style.backgroundColor = '#7a0e2b')}
                onMouseLeave={(e) => !emailSent && (e.currentTarget.style.backgroundColor = '#8f1133')}
              >
                {emailSent ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    <span>Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Selection Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-5xl w-full my-8" style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold" style={{ color: '#3A3A3A' }}>Choose Your Cover Design</h3>
                <p className="text-sm mt-1" style={{ color: '#6B5B73' }}>Select a cover for your story</p>
              </div>
              <button
                onClick={() => setShowCoverModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" style={{ color: '#6B5B73' }} />
              </button>
            </div>

            <div className={`grid ${gridCols} gap-6 mb-8`}>
              {filteredCovers.map((cover) => {
                const CoverComponent = cover.component;
                const isSelected = tempSelectedCoverId === cover.id;
                const accentColor = cover.colorScheme === 'navy' ? '#1e3a5f' : '#8f1133';
                return (
                  <div
                    key={cover.id}
                    onClick={() => setTempSelectedCoverId(cover.id)}
                    className="cursor-pointer transition-all hover:scale-105"
                  >
                    <div
                      className="aspect-[3/4] rounded-xl overflow-hidden relative"
                      style={{
                        boxShadow: isSelected ? `0 0 0 4px ${accentColor}` : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: isSelected ? '2px solid white' : 'none'
                      }}
                    >
                      <CoverComponent
                        title={currentProject.storytellerName || 'Sarah'}
                        subtitle="A Personal Journey"
                        role={currentProject.role || 'Mom'}
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                          <Check className="h-6 w-6" style={{ color: accentColor }} />
                        </div>
                      )}
                    </div>
                    <p className="text-center mt-3 font-semibold" style={{ color: isSelected ? accentColor : '#3A3A3A' }}>
                      {cover.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCoverModal(false)}
                className="flex-1 py-4 px-6 rounded-xl font-bold transition-all border-2"
                style={{ borderColor: '#8f1133', color: '#8f1133', backgroundColor: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5E6EA'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCover}
                className="flex-1 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#8f1133' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
              >
                Save Cover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}