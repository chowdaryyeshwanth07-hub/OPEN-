
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { libraryService } from '../services/libraryService';

const LibrarianChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hello! I am your Open Shelf librarian. Looking for a specific theme or author tonight?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const books = libraryService.getAllBooks();
    const response = await geminiService.askLibrarian(userText, books);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-[500px] bg-[#241814] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-[#3A2A23]">
          <div className="bg-gradient-to-r from-[#241814] to-[#1A120E] p-6 text-[#F5EFEA] flex justify-between items-center border-b border-[#3A2A23]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#E6B18A] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1A120E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg block">Open Shelf AI</span>
                <span className="text-[10px] text-[#E6B18A] font-bold uppercase tracking-widest">Active Assistant</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-[#E6B18A]/10 text-[#CBB8A9] rounded-xl p-2 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 bg-[#1A120E]/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#E6B18A] text-[#1A120E] font-medium rounded-tr-none shadow-md' 
                    : 'bg-[#241814] text-[#F5EFEA] border border-[#3A2A23] rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#241814] p-4 rounded-2xl border border-[#3A2A23] rounded-tl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-[#E6B18A] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#E6B18A] rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-[#E6B18A] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-6 bg-[#241814] border-t border-[#3A2A23]">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your librarian..."
                className="w-full pl-5 pr-14 py-3.5 bg-[#1F1511] border border-[#3A2A23] text-[#F5EFEA] rounded-2xl text-sm focus:ring-2 focus:ring-[#E6B18A] outline-none transition-all placeholder:text-[#8C7A6B]"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 p-2 bg-[#E6B18A] text-[#1A120E] hover:bg-[#D39A70] rounded-xl transition-all shadow-sm"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-[#E6B18A] to-[#D39A70] text-[#1A120E] rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-[#E6B18A]/20"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#F5EFEA] rounded-full border-4 border-[#1A120E] animate-pulse"></div>
        </button>
      )}
    </div>
  );
};

export default LibrarianChat;
