import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../supabase';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export function SignUpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'storyteller';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            plan: plan
          }
        }
      });

      if (authError) throw authError;

      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-burgundy-600 to-rose-600 rounded-2xl mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-warmGray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-warmGray-600">
            Start preserving your family's legacy
          </p>
          <div className="mt-3 inline-block bg-burgundy-50 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-warmGray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warmGray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-warmGray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-colors"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-warmGray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warmGray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-warmGray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-warmGray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-warmGray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-warmGray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500/20 focus:border-burgundy-500 transition-colors"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-burgundy-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:from-burgundy-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-warmGray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-burgundy-600 hover:text-burgundy-700 font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}