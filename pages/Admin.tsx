
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Zap, Database, X, Loader2 } from 'lucide-react';
import { libraryService } from '../services/libraryService.ts';
import { authService } from '../services/authService.ts';
import { geminiService } from '../services/geminiService.ts';
import { Book } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

const Admin: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categories: [] as string[],
    publishedYear: 2024,
    coverImageUrl: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      if (!authenticated) {
        navigate('/login');
        return;
      }
      
      const admin = await authService.isAdmin();
      if (!admin) {
        alert('Access Denied: Admin privileges required.');
        navigate('/');
      } else {
        setIsCheckingAuth(false);
        refreshBooks();
      }
    };
    checkAuth();
  }, [navigate]);

  const refreshBooks = async () => {
    const allBooks = await libraryService.getAllBooks();
    setBooks(allBooks);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E6B18A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setIsLoading(true);
      try {
        await libraryService.deleteBook(id);
        await refreshBooks();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete book. Check console for details.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await libraryService.updateBook(editingId, formData);
      } else {
        await libraryService.addBook(formData);
      }
      setIsModalOpen(false);
      await refreshBooks();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to save book. Check console for details.');
    } finally {
      setIsLoading(false);
    }
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

  const handleSeedDatabase = async () => {
    if (books.length > 0) {
      if (!window.confirm('This will add initial books to your library. Continue?')) return;
    }
    
    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      const { SAMPLE_100_BOOKS } = await import('../sampleBooks.ts');
      console.log(`Starting seeding of ${SAMPLE_100_BOOKS.length} books...`);
      
      for (const book of SAMPLE_100_BOOKS) {
        try {
          // @ts-ignore - bookData might have extra fields but addBook handles it
          const { id, createdAt, ...bookData } = book as any;
          await libraryService.addBook(bookData);
          successCount++;
          if (successCount % 10 === 0) {
            console.log(`Seeded ${successCount} books...`);
          }
        } catch (err) {
          console.error(`Failed to seed book: ${book.title}`, err);
          failCount++;
        }
      }
      
      await refreshBooks();
      
      if (failCount === 0) {
        alert(`Database seeded with ${successCount} books successfully!`);
      } else {
        alert(`Seeding complete. Success: ${successCount}, Failed: ${failCount}. Check console for details.`);
      }
    } catch (error) {
      console.error('Critical seeding error:', error);
      alert('Seeding failed. Check console for details.');
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
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleSeedDatabase}
            disabled={isLoading}
            className="flex items-center space-x-3 px-6 py-4 bg-[#1F1511] text-[#E6B18A] border border-[#E6B18A]/20 font-bold rounded-2xl shadow-xl hover:bg-[#E6B18A]/5 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Database className="w-6 h-6" />
            <span>Seed Data</span>
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center space-x-3 px-8 py-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
            <span>Add New Book</span>
          </button>
        </div>
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
                      title="Edit Book"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="p-3 text-[#CBB8A9] hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                      title="Delete Book"
                    >
                      <Trash2 className="w-5 h-5" />
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
                      <Zap className="w-7 h-7" fill="currentColor" />
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
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Auto-fill'}
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
                  disabled={isLoading}
                  className="px-10 py-4 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? 'Update Record' : 'Save New Book'}</span>
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
