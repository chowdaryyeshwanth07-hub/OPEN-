
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.signUp(email, password);
      alert('Check your email for confirmation!');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full space-y-10 bg-[#241814] p-10 rounded-[3rem] border border-[#3A2A23] shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#E6B18A] rounded-2xl flex items-center justify-center shadow-lg transform rotate-6 mb-6">
            <span className="text-[#1A120E] font-bold text-3xl">O</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#F5EFEA] tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-[#CBB8A9]">Enter your credentials to access your library</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest ml-1">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="librarian@openshelf.com"
                className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest ml-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 bg-transparent border border-[#3A2A23] text-[#F5EFEA] font-bold rounded-2xl hover:bg-[#241814] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </div>
        </form>
        
        <p className="text-center text-sm text-[#8C7A6B]">
          Don't have an account?{' '}
          <a href="#" className="font-bold text-[#E6B18A] hover:text-[#D39A70]">
            Request access
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
