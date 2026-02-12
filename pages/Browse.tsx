
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { libraryService } from '../services/libraryService';
import { Book, SortOption } from '../types';
import { CATEGORIES } from '../constants';
import BookCard from '../components/BookCard';

const Browse: React.FC = () => {
  const location = useLocation();
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState(location.state?.initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<SortOption>(SortOption.NEWEST);

  useEffect(() => {
    const filtered = libraryService.searchAndFilter(keyword, selectedCategory, sortOrder);
    setBooks(filtered);
  }, [keyword, selectedCategory, sortOrder]);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-[#F5EFEA] tracking-tight">Explore Library</h1>
        <p className="text-[#CBB8A9]">Discover your next favorite story among our curated selection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="space-y-10">
          {/* Search Box */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em]">Search</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Title, author, keywords..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] focus:border-transparent transition-all placeholder:text-[#8C7A6B]"
              />
              <svg className="absolute left-4 top-4.5 w-5 h-5 text-[#8C7A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em]">Categories</label>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  selectedCategory === 'All' 
                    ? 'bg-[#E6B18A] text-[#1A120E] shadow-lg shadow-[#E6B18A]/10' 
                    : 'bg-[#1F1511] text-[#CBB8A9] border border-[#3A2A23] hover:border-[#E6B18A]/40'
                }`}
              >
                All
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#E6B18A] text-[#1A120E] shadow-lg shadow-[#E6B18A]/10' 
                      : 'bg-[#1F1511] text-[#CBB8A9] border border-[#3A2A23] hover:border-[#E6B18A]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em]">Sort By</label>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOption)}
              className="w-full px-4 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] focus:border-transparent transition-all outline-none appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238C7A6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
            >
              <option value={SortOption.NEWEST}>Newest First</option>
              <option value={SortOption.OLDEST}>Oldest First</option>
              <option value={SortOption.TITLE_ASC}>Title: A to Z</option>
              <option value={SortOption.TITLE_DESC}>Title: Z to A</option>
            </select>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="lg:col-span-3">
          {books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#3A2A23] rounded-[2.5rem]">
              <div className="w-24 h-24 bg-[#1F1511] rounded-full flex items-center justify-center text-[#8C7A6B] mb-8">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#F5EFEA]">No books found</h3>
              <p className="text-[#CBB8A9] mt-3">Try adjusting your filters or search keywords.</p>
              <button 
                onClick={() => {
                  setKeyword('');
                  setSelectedCategory('All');
                  setSortOrder(SortOption.NEWEST);
                }}
                className="mt-10 px-8 py-3 text-[#E6B18A] font-bold hover:bg-[#E6B18A]/10 border border-[#E6B18A]/20 rounded-2xl transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
