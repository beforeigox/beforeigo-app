import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Gift, User, ArrowRight, ChefHat, BookOpen } from 'lucide-react';

const planNames = {
  storyteller: 'The Storyteller',
  keepsake: 'The Keepsake',
  legacy: 'The Legacy',
  storyteller_recipe: 'The Storyteller + Recipe Book',
  keepsake_recipe: 'The Keepsake + Recipe Book',
};

export function GiftChoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedChoice, setSelectedChoice] = useState<'self' | 'gift' | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);

  const plan = searchParams.get('plan') as keyof typeof planNames || 'storyteller';
  const sessionId = searchParams.get('session_id');
  const hasRecipe = plan.includes('_recipe');
  const basePlan = plan.replace('_recipe', '') as 'storyteller' | 'keepsake' | 'legacy';

  const handleSelfChoice = () => {
    // Redirect to signup with plan info
    navigate(`/signup?plan=${plan}&session_id=${sessionId}`);
  };

  const handleGiftSend = async () => {
    if (!recipientEmail.trim()) {
      alert('Please enter a valid email address');
      return;
    }

    setSending(true);

    // TODO: Send gift email via API
    // For now, simulate
    setTimeout(() => {
      alert(`🎁 Gift sent to ${recipientEmail}!\n\nThey'll receive an email with instructions to claim their ${planNames[plan]}.`);
      setSending(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="max-w-2xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6" style={{ color: '#8f1133' }} />
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#8f1133' }}>Before I Go</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-3" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
            Your Purchase is Complete!
          </h1>
          <p className="text-lg mb-2" style={{ color: '#6B5B73' }}>
            You've purchased: <span className="font-bold" style={{ color: '#8f1133' }}>{planNames[plan]}</span>
          </p>
          <p style={{ color: '#6B5B73' }}>
            Is this for you or a gift for someone special?
          </p>
        </div>

        {/* Choice Cards */}
        {!selectedChoice && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* For Myself */}
            <div
              onClick={() => setSelectedChoice('self')}
              className="bg-white rounded-2xl p-8 cursor-pointer transition-all border-2"
              style={{ 
                borderColor: '#E5D5D8',
                boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.08)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8f1133';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(143, 17, 51, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5D5D8';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.08)';
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
                <User className="h-7 w-7" style={{ color: '#8f1133' }} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
                For Myself
              </h3>
              <p className="mb-6" style={{ color: '#6B5B73' }}>
                Start preserving your story today
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#3A3A3A' }}>
                  <BookOpen className="h-4 w-4" style={{ color: '#8f1133' }} />
                  <span>Start Your Legacy Story</span>
                </div>
                {hasRecipe && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#3A3A3A' }}>
                    <ChefHat className="h-4 w-4" style={{ color: '#8f1133' }} />
                    <span>Start Your Recipe Book</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#8f1133' }}>
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* As a Gift */}
            <div
              onClick={() => setSelectedChoice('gift')}
              className="bg-white rounded-2xl p-8 cursor-pointer transition-all border-2"
              style={{ 
                borderColor: '#E5D5D8',
                boxShadow: '0 4px 6px -1px rgba(143, 17, 51, 0.08)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#8f1133';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(143, 17, 51, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5D5D8';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(143, 17, 51, 0.08)';
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#F5E6EA' }}>
                <Gift className="h-7 w-7" style={{ color: '#8f1133' }} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: '#3A3A3A', fontFamily: 'Crimson Text, serif' }}>
                As a Gift
              </h3>
              <p className="mb-6" style={{ color: '#6B5B73' }}>
                Send to someone special
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="text-sm" style={{ color: '#3A3A3A' }}>
                  • Beautiful email invitation
                </div>
                <div className="text-sm" style={{ color: '#3A3A3A' }}>
                  • Instant delivery
                </div>
                <div className="text-sm" style={{ color: '#3A3A3A' }}>
                  • Personal message option
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: '#8f1133' }}>
                <span>Send Gift</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

          </div>
        )}

        {/* Self Flow */}
        {selectedChoice === 'self' && (
          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#3A3A3A' }}>Perfect! Let's Get Started</h3>
            
            <div className="space-y-4 mb-8 p-5 rounded-xl" style={{ backgroundColor: '#F5E6EA' }}>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5" style={{ color: '#8f1133' }} />
                <div className="flex-1">
                  <p className="font-medium" style={{ color: '#3A3A3A' }}>Your Legacy Story</p>
                  <p className="text-sm" style={{ color: '#6B5B73' }}>72 questions to preserve your memories</p>
                </div>
              </div>
              
              {hasRecipe && (
                <div className="flex items-center gap-3">
                  <ChefHat className="h-5 w-5" style={{ color: '#8f1133' }} />
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#3A3A3A' }}>Your Recipe Book</p>
                    <p className="text-sm" style={{ color: '#6B5B73' }}>Preserve family recipes forever</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSelfChoice}
              className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a0e2b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8f1133'}
            >
              <span>Continue to Create Account</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setSelectedChoice(null)}
              className="w-full mt-3 py-3 text-sm"
              style={{ color: '#6B5B73' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3A3A3A'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B5B73'}
            >
              ← Go back
            </button>
          </div>
        )}

        {/* Gift Flow */}
        {selectedChoice === 'gift' && (
          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 10px 15px -3px rgba(143, 17, 51, 0.1)' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#3A3A3A' }}>Send Your Gift</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#3A3A3A' }}>
                Recipient's Email Address
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="their@email.com"
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors"
                style={{ borderColor: '#E5D5D8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8f1133'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5D5D8'}
              />
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: '#F5E6EA' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#3A3A3A' }}>They'll receive:</p>
              <ul className="text-sm space-y-1" style={{ color: '#6B5B73' }}>
                <li>• {planNames[plan]}</li>
                <li>• Instructions to create their account</li>
                <li>• Immediate access to start their story</li>
                {hasRecipe && <li>• Recipe Book to preserve family recipes</li>}
              </ul>
            </div>

            <button
              onClick={handleGiftSend}
              disabled={sending}
              className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#8f1133' }}
              onMouseEnter={(e) => !sending && (e.currentTarget.style.backgroundColor = '#7a0e2b')}
              onMouseLeave={(e) => !sending && (e.currentTarget.style.backgroundColor = '#8f1133')}
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Gift className="h-5 w-5" />
                  <span>Send Gift</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedChoice(null)}
              className="w-full mt-3 py-3 text-sm"
              style={{ color: '#6B5B73' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3A3A3A'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6B5B73'}
            >
              ← Go back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
