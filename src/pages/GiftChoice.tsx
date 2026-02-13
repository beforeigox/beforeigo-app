import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Heart, Mail, ArrowRight, Gift, Sparkles } from 'lucide-react';

export function GiftChoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'storyteller';
  const sessionId = searchParams.get('session_id');
  
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [giftEmail, setGiftEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleForMyself = () => {
    // Redirect to signup with plan info
    navigate(`/signup?plan=${plan}`);
  };

	const handleSendGift = async () => {
  if (!giftEmail) {
    alert('Please enter recipient email');
    return;
  }

  setSending(true);

  try {
    // TODO: Send actual email via Resend
    console.log('Sending gift to:', giftEmail, 'Message:', giftMessage);
    
    // Show success screen
    setShowSuccess(true);
    
  } catch (error) {
    console.error('Error sending gift:', error);
    alert('Failed to send gift. Please try again.');
  } finally {
    setSending(false);
  }
};
if (showSuccess) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-3">
          Gift Sent Successfully!
        </h1>
        <p className="text-warmGray-600 mb-6">
          Your gift has been sent to<br />
          <span className="font-semibold text-warmGray-900">{giftEmail}</span>
        </p>
        <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold text-warmGray-900 mb-3">What happens next:</h3>
          <ul className="space-y-2 text-sm text-warmGray-700">
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>They'll receive an email with a magic link</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>They'll create their account and start their story</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>They can begin capturing memories right away</span>
            </li>
          </ul>
        </div>
        {giftMessage && (
          <div className="bg-warmGray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-warmGray-600 mb-1">Your message:</p>
            <p className="text-warmGray-700 italic">"{giftMessage}"</p>
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-burgundy-600 to-rose-600 text-white py-4 rounded-xl font-semibold hover:from-burgundy-700 hover:to-rose-700 transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}

  if (showGiftForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
              Send Your Gift
            </h1>
            <p className="text-warmGray-600">
              They'll receive a magic link to start their story
            </p>
            <div className="mt-3 inline-block bg-burgundy-50 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium">
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </div>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <label htmlFor="gift-email" className="block text-sm font-medium text-warmGray-700 mb-2">
                Recipient's Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warmGray-400" />
                <input
                  id="gift-email"
                  type="email"
                  required
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-warmGray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-colors"
                  placeholder="recipient@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gift-message" className="block text-sm font-medium text-warmGray-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                id="gift-message"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-warmGray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-colors resize-none"
                placeholder="Add a personal message..."
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowGiftForm(false)}
              className="flex-1 bg-warmGray-200 text-warmGray-700 py-3 rounded-xl font-medium hover:bg-warmGray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSendGift}
              disabled={sending}
              className="flex-1 bg-gradient-to-r from-burgundy-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-burgundy-700 hover:to-rose-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Gift</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-warmGray-600">
            Who is this story for?
          </p>
          <div className="mt-3 inline-block bg-burgundy-50 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleForMyself}
            className="w-full flex items-center justify-between p-6 border-2 border-warmGray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-colors">
                <User className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-warmGray-900">For Myself</div>
                <div className="text-sm text-warmGray-600">Start creating your story now</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-warmGray-400 group-hover:text-blue-500" />
          </button>

          <button
            onClick={() => setShowGiftForm(true)}
            className="w-full flex items-center justify-between p-6 border-2 border-warmGray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-500 transition-colors">
                <Heart className="h-6 w-6 text-amber-600 group-hover:text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-warmGray-900">For Someone Else (Gift)</div>
                <div className="text-sm text-warmGray-600">Send this as a gift</div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-warmGray-400 group-hover:text-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
}