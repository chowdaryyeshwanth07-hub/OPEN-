
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock validation
    if (username.trim()) {
      authService.login(username);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest ml-1">Username or Email</label>
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#E6B18A] focus:ring-[#E6B18A] border-[#3A2A23] bg-[#1F1511] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#CBB8A9]">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-bold text-[#E6B18A] hover:text-[#D39A70]">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95"
            >
              Sign In
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
