
import React, { useEffect, useState } from 'react';
import { libraryService } from '../services/libraryService';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const all = libraryService.getAllBooks();
    const sorted = [...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
    setFeaturedBooks(sorted);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse`, { state: { initialSearch: searchQuery } });
    }
  };

  return (
    <div className="space-y-20 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#241814] border border-[#3A2A23] py-24 px-6 sm:px-12 text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E6B18A] rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#D39A70] rounded-full blur-[120px] animate-pulse delay-700"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E6B18A]/10 border border-[#E6B18A]/20 text-[#E6B18A] text-xs font-bold tracking-widest uppercase">
            Your Digital Library
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-[#F5EFEA] tracking-tight leading-[1.05]">
            Discover Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E6B18A] to-[#D39A70]">
              Next Great Read
            </span>
          </h1>
          <p className="text-lg text-[#CBB8A9] leading-relaxed max-w-2xl mx-auto">
            Explore our curated collection of books. Search, browse, and manage your personal library all in one place.
          </p>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch gap-3 pt-6">
            <div className="flex-grow relative">
              <input 
                type="text" 
                placeholder="Search by title, author, or description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
              />
              <svg className="absolute left-4 top-4.5 w-6 h-6 text-[#8C7A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              className="px-10 py-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl shadow-[#E6B18A]/10 hover:bg-[#D39A70] transition-all transform active:scale-95 whitespace-nowrap"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              to="/browse" 
              className="w-full sm:w-auto px-10 py-4 bg-[#F5EFEA] text-[#1A120E] font-bold rounded-2xl shadow-lg hover:bg-white hover:-translate-y-1 transition-all"
            >
              Browse All Books
            </Link>
            <Link 
              to="/admin" 
              className="w-full sm:w-auto px-10 py-4 bg-[#1F1511] text-[#F5EFEA] font-bold rounded-2xl border border-[#3A2A23] hover:bg-[#241814] hover:border-[#E6B18A]/40 transition-all"
            >
              Manage Library
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Additions Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-[#F5EFEA]">Latest Additions</h2>
            <p className="text-[#CBB8A9] mt-3">Recently added books to our collection</p>
          </div>
          <Link to="/browse" className="group flex items-center text-[#E6B18A] font-bold hover:text-[#D39A70] transition-colors">
            View All 
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {featuredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="grid md:grid-cols-3 gap-8 pb-10">
        <div className="p-8 bg-[#241814] rounded-3xl border border-[#3A2A23] shadow-sm hover:border-[#E6B18A]/20 transition-all">
          <div className="w-14 h-14 bg-[#E6B18A]/10 rounded-2xl flex items-center justify-center text-[#E6B18A] mb-8">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#F5EFEA] mb-4">Extensive Catalog</h3>
          <p className="text-[#8C7A6B] leading-relaxed">
            From fiction to philosophy, our database spans centuries of literary achievements in a beautiful dark interface.
          </p>
        </div>
        <div className="p-8 bg-[#241814] rounded-3xl border border-[#3A2A23] shadow-sm hover:border-[#E6B18A]/20 transition-all">
          <div className="w-14 h-14 bg-[#E6B18A]/10 rounded-2xl flex items-center justify-center text-[#E6B18A] mb-8">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#F5EFEA] mb-4">Instant Search</h3>
          <p className="text-[#8C7A6B] leading-relaxed">
            Find exactly what you're looking for with our lightning-fast search and filter tools optimized for speed.
          </p>
        </div>
        <div className="p-8 bg-[#241814] rounded-3xl border border-[#3A2A23] shadow-sm hover:border-[#E6B18A]/20 transition-all">
          <div className="w-14 h-14 bg-[#E6B18A]/10 rounded-2xl flex items-center justify-center text-[#E6B18A] mb-8">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
             </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#F5EFEA] mb-4">AI Features</h3>
          <p className="text-[#8C7A6B] leading-relaxed">
            Leverage Google Gemini for smart book summaries and catalog management within your library workspace.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
