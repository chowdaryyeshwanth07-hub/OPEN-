
import { Book, SortOption } from '../types.ts';
import { db } from '../firebase.ts';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils.ts';

const COLLECTION_NAME = 'poems';

const normalizeUrl = (url?: string) => {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  // If it's just a domain or path, assume https
  return `https://${trimmed}`;
};

const normalizeBook = (docId: string, data: any): Book => {
  return {
    id: docId as any,
    ...data,
    viewUrl: normalizeUrl(data.viewUrl || data.view_url),
    downloadUrl: normalizeUrl(data.downloadUrl || data.download_url),
    coverImageUrl: data.coverImageUrl || data.cover_image_url,
    publishedYear: data.publishedYear || data.published_year,
  } as Book;
};

export const libraryService = {
  getAllBooks: async (): Promise<Book[]> => {
    console.log(`Fetching all books from collection: ${COLLECTION_NAME}`);
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.docs.length} documents in ${COLLECTION_NAME}`);
      const books = querySnapshot.docs.map(doc => normalizeBook(doc.id, doc.data()));
      
      // Deduplicate in memory to ensure UI is clean
      const uniqueBooks: Book[] = [];
      const seen = new Set<string>();
      for (const book of books) {
        const identifier = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}`;
        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueBooks.push(book);
        }
      }
      
      // Sort in memory to avoid issues with missing createdAt fields in Firestore
      return uniqueBooks.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        
        // Handle NaN
        const timeA = isNaN(dateA) ? 0 : dateA;
        const timeB = isNaN(dateB) ? 0 : dateB;
        
        return timeB - timeA;
      });
    } catch (error) {
      console.error(`Error in getAllBooks for collection ${COLLECTION_NAME}:`, error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  getBook: async (id: string): Promise<Book | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return normalizeBook(docSnap.id, docSnap.data());
      }
      return undefined;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
      return undefined;
    }
  },

  addBook: async (book: Omit<Book, 'id' | 'createdAt'>): Promise<Book | null> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...book,
        createdAt: serverTimestamp()
      });
      const newDoc = await getDoc(docRef);
      const data = newDoc.data();
      if (!data) return null;
      
      return normalizeBook(newDoc.id, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return null;
    }
  },

  updateBook: async (id: string, updated: Partial<Book>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      // Normalize URLs if they are being updated
      const toUpdate = { ...updated };
      if (toUpdate.viewUrl) toUpdate.viewUrl = normalizeUrl(toUpdate.viewUrl);
      if (toUpdate.downloadUrl) toUpdate.downloadUrl = normalizeUrl(toUpdate.downloadUrl);
      
      await updateDoc(docRef, toUpdate);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      return false;
    }
  },

  deleteBook: async (id: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
      return false;
    }
  },

  deduplicateBooks: async (): Promise<{ deleted: number }> => {
    try {
      const allBooks = await libraryService.getAllBooks();
      const seen = new Set<string>();
      let deletedCount = 0;

      for (const book of allBooks) {
        const identifier = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}`;
        if (seen.has(identifier)) {
          await libraryService.deleteBook(book.id);
          deletedCount++;
        } else {
          seen.add(identifier);
        }
      }
      return { deleted: deletedCount };
    } catch (error) {
      console.error('Deduplication failed:', error);
      return { deleted: 0 };
    }
  },

  searchAndFilter: async (keyword: string, category: string, sort: SortOption): Promise<Book[]> => {
    try {
      let q = query(collection(db, COLLECTION_NAME));

      const querySnapshot = await getDocs(q);
      let books = querySnapshot.docs.map(doc => normalizeBook(doc.id, doc.data()));

      // Deduplicate in memory to ensure UI is clean
      const uniqueBooks: Book[] = [];
      const seen = new Set<string>();
      for (const book of books) {
        const identifier = `${book.title.trim().toLowerCase()}|${book.author.trim().toLowerCase()}`;
        if (!seen.has(identifier)) {
          seen.add(identifier);
          uniqueBooks.push(book);
        }
      }
      books = uniqueBooks;

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

      books.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
        
        switch (sort) {
          case SortOption.NEWEST: return dateB - dateA;
          case SortOption.OLDEST: return dateA - dateB;
          case SortOption.TITLE_ASC: return a.title.localeCompare(b.title);
          case SortOption.TITLE_DESC: return b.title.localeCompare(a.title);
          default: return 0;
        }
      });

      return books;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  }
};
