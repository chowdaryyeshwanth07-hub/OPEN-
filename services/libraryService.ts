
import { Book, SortOption } from '../types';
import { INITIAL_BOOKS } from '../constants';

const STORAGE_KEY = 'openshelf_data';

export const libraryService = {
  getStore: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = { books: INITIAL_BOOKS, nextId: INITIAL_BOOKS.length + 1 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveStore: (books: Book[], nextId: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ books, nextId }));
  },

  getAllBooks: (): Book[] => {
    return libraryService.getStore().books;
  },

  getBook: (id: number): Book | undefined => {
    return libraryService.getStore().books.find((b: Book) => b.id === id);
  },

  addBook: (book: Omit<Book, 'id' | 'createdAt'>): Book => {
    const { books, nextId } = libraryService.getStore();
    const newBook: Book = {
      ...book,
      id: nextId,
      createdAt: Date.now()
    };
    libraryService.saveStore([...books, newBook], nextId + 1);
    return newBook;
  },

  updateBook: (id: number, updated: Partial<Book>): boolean => {
    const { books, nextId } = libraryService.getStore();
    const index = books.findIndex((b: Book) => b.id === id);
    if (index === -1) return false;
    
    books[index] = { ...books[index], ...updated };
    libraryService.saveStore(books, nextId);
    return true;
  },

  deleteBook: (id: number): boolean => {
    const { books, nextId } = libraryService.getStore();
    const filtered = books.filter((b: Book) => b.id !== id);
    if (filtered.length === books.length) return false;
    libraryService.saveStore(filtered, nextId);
    return true;
  },

  searchAndFilter: (keyword: string, category: string, sort: SortOption): Book[] => {
    let books = libraryService.getAllBooks();

    if (keyword) {
      const lower = keyword.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(lower) || 
        b.author.toLowerCase().includes(lower) ||
        b.description.toLowerCase().includes(lower)
      );
    }

    if (category && category !== 'All') {
      books = books.filter(b => b.categories.includes(category));
    }

    switch (sort) {
      case SortOption.NEWEST:
        books.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case SortOption.OLDEST:
        books.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case SortOption.TITLE_ASC:
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SortOption.TITLE_DESC:
        books.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return books;
  }
};
