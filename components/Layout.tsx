
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, BookOpen } from 'lucide-react';
import { authService } from '../services/authService.ts';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
        isActive 
          ? 'bg-[#E6B18A] text-[#1A120E] shadow-lg shadow-[#E6B18A]/20' 
          : 'text-[#CBB8A9] hover:text-[#F5EFEA] hover:bg-[#241814]'
      }`}
    >
      {children}
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      if (authStatus) {
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAuth();

    const unsubscribe = authService.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1A120E]">
      <header className="sticky top-0 z-50 glass-effect">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="p-2 text-[#8C7A6B] hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all flex items-center group"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
                <span className="ml-2 hidden lg:inline font-bold text-xs uppercase tracking-widest">Logout</span>
              </button>
            )}
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#E6B18A] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-[#1A120E] font-bold text-xl">O</span>
              </div>
              <span className="text-xl font-bold text-[#F5EFEA] tracking-tight">
                Open Shelf
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/browse">Browse</NavLink>
            {isAdmin && <NavLink to="/admin">Manage</NavLink>}
            {!isAuthenticated && location.pathname !== '/login' && (
              <NavLink to="/login">Login</NavLink>
            )}
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#CBB8A9] hover:text-[#F5EFEA] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#241814] border-b border-[#3A2A23] py-6 px-4 space-y-4 animate-slideDown">
            <div className="flex flex-col space-y-3">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/browse">Browse</NavLink>
              {isAdmin && <NavLink to="/admin">Manage</NavLink>}
              {!isAuthenticated && location.pathname !== '/login' && (
                <NavLink to="/login">Login</NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="bg-[#241814] text-[#CBB8A9] py-12 border-t border-[#3A2A23]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
             <div className="w-8 h-8 bg-[#E6B18A] rounded flex items-center justify-center text-[#1A120E] font-bold">O</div>
             <span className="text-[#F5EFEA] font-bold text-lg">Open Shelf Library</span>
          </div>
          <p className="max-w-md mx-auto mb-8 text-[#8C7A6B]">
            Elevating your reading experience with intelligent cataloging and AI-driven insights. Built for the modern bibliophile.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <Link to="/privacy" className="hover:text-[#F5EFEA] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#F5EFEA] transition-colors">Terms</Link>
            <a href="#" className="hover:text-[#F5EFEA] transition-colors">API</a>
          </div>
          <p className="text-sm text-[#8C7A6B]">
            &copy; {new Date().getFullYear()} Open Shelf Library MVP.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
