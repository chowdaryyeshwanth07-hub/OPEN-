
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link 
      to={`/book/${book.id}`}
      className="group relative bg-[#241814] rounded-2xl overflow-hidden border border-[#3A2A23] shadow-sm hover:shadow-2xl hover:border-[#E6B18A]/30 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-[2/3] overflow-hidden bg-[#1F1511]">
        <img 
          src={book.coverImageUrl || `https://picsum.photos/seed/${book.id}/400/600`} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1543005128-8182cd3a3ad7?q=80&w=800&auto=format&fit=crop";
          }}
        />
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[70%]">
          {book.categories.slice(0, 2).map(cat => (
            <span key={cat} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#E6B18A]/90 text-[#1A120E] rounded-md backdrop-blur-sm">
              {cat}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-[#F5EFEA] group-hover:text-[#E6B18A] transition-colors line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-[#CBB8A9] mb-2">{book.author}</p>
        <p className="text-xs text-[#8C7A6B] line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </div>
    </Link>
  );
};

export default BookCard;
