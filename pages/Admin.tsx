
import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { geminiService } from '../services/geminiService';
import { Book } from '../types';
import { CATEGORIES } from '../constants';

const Admin: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categories: [] as string[],
    publishedYear: 2024,
    coverImageUrl: ''
  });

  useEffect(() => {
    refreshBooks();
  }, []);

  const refreshBooks = () => {
    setBooks(libraryService.getAllBooks());
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      author: '',
      description: '',
      categories: [],
      publishedYear: 2024,
      coverImageUrl: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      categories: book.categories,
      publishedYear: book.publishedYear || 2024,
      coverImageUrl: book.coverImageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      libraryService.deleteBook(id);
      refreshBooks();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      libraryService.updateBook(editingId, formData);
    } else {
      libraryService.addBook(formData);
    }
    setIsModalOpen(false);
    refreshBooks();
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleAiAutoFill = async () => {
    if (!formData.title || !formData.author) {
      alert('Please enter Title and Author first for AI to generate info.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await geminiService.generateBookDescription(formData.title, formData.author);
      setFormData(prev => ({
        ...prev,
        description: result.description,
        categories: result.categories,
        publishedYear: result.year
      }));
    } catch (error) {
      alert('AI Auto-fill failed. Please try manual entry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#F5EFEA] tracking-tight">Library Manager</h1>
          <p className="text-[#CBB8A9] mt-3">Curate and maintain your digital collection workspace.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center space-x-3 px-8 py-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Book</span>
        </button>
      </div>

      {/* Book Table */}
      <div className="bg-[#241814] rounded-[2.5rem] border border-[#3A2A23] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1F1511] border-b border-[#3A2A23]">
                <th className="px-8 py-6 text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em]">Book Details</th>
                <th className="px-8 py-6 text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em] hidden md:table-cell">Categories</th>
                <th className="px-8 py-6 text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em] hidden sm:table-cell text-center">Year</th>
                <th className="px-8 py-6 text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A2A23]">
              {books.map(book => (
                <tr key={book.id} className="hover:bg-[#1F1511]/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-18 rounded-xl overflow-hidden bg-[#1F1511] flex-shrink-0 border border-[#3A2A23]">
                         <img src={book.coverImageUrl || `https://picsum.photos/seed/${book.id}/400/600`} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div>
                        <p className="font-bold text-[#F5EFEA] group-hover:text-[#E6B18A] transition-colors">{book.title}</p>
                        <p className="text-sm text-[#CBB8A9] mt-1">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden md:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {book.categories.slice(0, 2).map(cat => (
                        <span key={cat} className="px-2.5 py-1 bg-[#E6B18A]/5 text-[#E6B18A] text-[10px] font-bold uppercase rounded-lg border border-[#E6B18A]/10">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 hidden sm:table-cell text-[#CBB8A9] text-center font-medium">
                    {book.publishedYear}
                  </td>
                  <td className="px-8 py-6 text-right space-x-3">
                    <button 
                      onClick={() => openEditModal(book)}
                      className="p-3 text-[#CBB8A9] hover:text-[#E6B18A] hover:bg-[#E6B18A]/5 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="p-3 text-[#CBB8A9] hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A120E]/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#241814] rounded-[3rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto border border-[#3A2A23]">
            <h2 className="text-3xl font-extrabold text-[#F5EFEA] mb-10">{editingId ? 'Edit Book Record' : 'Add New Title'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Book Title *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({...p, title: e.target.value}))}
                    className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Author Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData(p => ({...p, author: e.target.value}))}
                    className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
                  />
                </div>
              </div>

              {/* AI Trigger */}
              <div className="bg-[#E6B18A]/5 p-6 rounded-3xl flex items-center justify-between border border-[#E6B18A]/10">
                 <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 bg-[#E6B18A] rounded-2xl flex items-center justify-center text-[#1A120E]">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                   </div>
                   <div>
                     <p className="font-bold text-[#F5EFEA] text-base">Smart Metadata</p>
                     <p className="text-sm text-[#CBB8A9]">Use AI to populate description and years.</p>
                   </div>
                 </div>
                 <button 
                  type="button"
                  disabled={isLoading}
                  onClick={handleAiAutoFill}
                  className="px-6 py-2.5 bg-[#E6B18A] text-[#1A120E] font-bold text-sm rounded-xl shadow-lg hover:bg-[#D39A70] transition-all flex items-center space-x-2"
                 >
                   {isLoading ? <div className="w-4 h-4 border-2 border-[#1A120E] border-t-transparent rounded-full animate-spin"></div> : 'Auto-fill'}
                 </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Detailed Description *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({...p, description: e.target.value}))}
                  className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all resize-none placeholder:text-[#8C7A6B]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        formData.categories.includes(cat)
                          ? 'bg-[#E6B18A] text-[#1A120E] shadow-lg'
                          : 'bg-[#1F1511] text-[#CBB8A9] border border-[#3A2A23] hover:border-[#E6B18A]/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Publication Year</label>
                  <input 
                    type="number" 
                    value={formData.publishedYear}
                    onChange={(e) => setFormData(p => ({...p, publishedYear: parseInt(e.target.value)}))}
                    className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#8C7A6B] uppercase tracking-widest">Image URL</label>
                  <input 
                    type="url" 
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData(p => ({...p, coverImageUrl: e.target.value}))}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-5 py-4 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-6 pt-10 border-t border-[#3A2A23]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 font-bold text-[#8C7A6B] hover:text-[#F5EFEA] transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="px-10 py-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95"
                >
                  {editingId ? 'Update Record' : 'Save New Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
