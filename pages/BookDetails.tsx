
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { libraryService } from '../services/libraryService.ts';
import { geminiService } from '../services/geminiService.ts';
import { Book } from '../types.ts';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (id) {
      const found = libraryService.getBook(Number(id));
      if (found) {
        setBook(found);
      }
    }
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!book) return;
    setLoadingSummary(true);
    const summary = await geminiService.getBookSummary(book);
    setAiSummary(summary);
    setLoadingSummary(false);
  };

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
         <h2 className="text-3xl font-bold text-[#F5EFEA]">Book Not Found</h2>
         <Link to="/browse" className="mt-6 text-[#E6B18A] font-bold hover:text-[#D39A70]">Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
      <Link to="/browse" className="inline-flex items-center text-[#CBB8A9] hover:text-[#E6B18A] font-bold transition-colors">
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cover */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-[#241814] p-3 border border-[#3A2A23]">
             <img 
               src={book.coverImageUrl || `https://picsum.photos/seed/${book.id}/400/600`} 
               alt={book.title} 
               className="w-full aspect-[2/3] object-cover rounded-[2.5rem] opacity-90"
             />
          </div>
          <div className="flex flex-col gap-4">
             <button className="w-full py-4.5 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-xl hover:bg-[#D39A70] transition-all transform active:scale-[0.98]">
                Read Online
             </button>
             <button className="w-full py-4.5 bg-[#1F1511] text-[#F5EFEA] font-bold rounded-2xl border border-[#3A2A23] hover:bg-[#241814] transition-all">
                Download PDF
             </button>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-8 space-y-10">
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {book.categories.map(cat => (
                <span key={cat} className="px-4 py-1.5 bg-[#E6B18A]/10 text-[#E6B18A] rounded-xl text-xs font-bold uppercase tracking-widest border border-[#E6B18A]/20">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#F5EFEA] leading-[1.1] mb-6">
              {book.title}
            </h1>
            <p className="text-2xl text-[#CBB8A9] font-medium italic">By {book.author}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 py-10 border-y border-[#3A2A23]">
            <div>
              <p className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em] mb-2">Published</p>
              <p className="text-xl font-bold text-[#F5EFEA]">{book.publishedYear || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#8C7A6B] uppercase tracking-[0.2em] mb-2">Library ID</p>
              <p className="text-xl font-bold text-[#F5EFEA]">#LMB-{book.id.toString().padStart(4, '0')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#F5EFEA]">Book Description</h3>
            <p className="text-[#CBB8A9] leading-[1.8] text-lg">
              {book.description}
            </p>
          </div>

          {/* AI Summary Section */}
          <div className="p-10 rounded-[2.5rem] bg-[#1F1511] border border-[#E6B18A]/20 shadow-sm space-y-6 relative overflow-hidden group">
             <div className="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
               <svg className="w-48 h-48 text-[#E6B18A]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2L14.4 9.2H22L15.8 13.8L18.2 21L12 16.4L5.8 21L8.2 13.8L2 9.2H9.6L12 2Z" />
               </svg>
             </div>
             
             <div className="flex items-center space-x-3">
                <span className="w-10 h-10 rounded-xl bg-[#E6B18A] flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1A120E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <h3 className="text-xl font-bold text-[#F5EFEA]">AI Librarian Summary</h3>
             </div>

             {aiSummary ? (
               <div className="relative">
                 <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#E6B18A]/30 rounded-full"></div>
                 <p className="text-[#F5EFEA] leading-[1.8] text-lg italic pl-4">"{aiSummary}"</p>
               </div>
             ) : (
               <div className="space-y-6">
                 <p className="text-[#CBB8A9] text-lg italic">Curious about the depth of this work? Our AI can distill its core themes for you instantly.</p>
                 <button 
                   onClick={handleGenerateSummary}
                   disabled={loadingSummary}
                   className="px-8 py-3 bg-[#E6B18A] text-[#1A120E] font-bold rounded-2xl shadow-lg hover:bg-[#D39A70] transition-all flex items-center space-x-3"
                 >
                   {loadingSummary ? (
                     <>
                       <div className="w-5 h-5 border-3 border-[#1A120E] border-t-transparent rounded-full animate-spin"></div>
                       <span>Analyzing...</span>
                     </>
                   ) : (
                     <>
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                       <span>Generate AI Insight</span>
                     </>
                   )}
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
