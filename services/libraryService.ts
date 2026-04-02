
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

export const libraryService = {
  getAllBooks: async (): Promise<Book[]> => {
    console.log(`Fetching all books from collection: ${COLLECTION_NAME}`);
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      console.log(`Found ${querySnapshot.docs.length} documents in ${COLLECTION_NAME}`);
      const books = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id as any,
          ...data,
          viewUrl: data.viewUrl || data.view_url,
          downloadUrl: data.downloadUrl || data.download_url,
          coverImageUrl: data.coverImageUrl || data.cover_image_url,
          publishedYear: data.publishedYear || data.published_year,
        } as Book;
      });
      
      // Sort in memory to avoid issues with missing createdAt fields in Firestore
      return books.sort((a, b) => {
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
        const data = docSnap.data();
        return { 
          id: docSnap.id as any, 
          ...data,
          viewUrl: data.viewUrl || data.view_url,
          downloadUrl: data.downloadUrl || data.download_url,
          coverImageUrl: data.coverImageUrl || data.cover_image_url,
          publishedYear: data.publishedYear || data.published_year,
        } as Book;
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
      
      return { 
        id: newDoc.id as any, 
        ...data,
        viewUrl: data.viewUrl || data.view_url,
        downloadUrl: data.downloadUrl || data.download_url,
        coverImageUrl: data.coverImageUrl || data.cover_image_url,
        publishedYear: data.publishedYear || data.published_year,
      } as Book;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      return null;
    }
  },

  updateBook: async (id: string, updated: Partial<Book>): Promise<boolean> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updated);
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

  searchAndFilter: async (keyword: string, category: string, sort: SortOption): Promise<Book[]> => {
    try {
      let q = query(collection(db, COLLECTION_NAME));

      const querySnapshot = await getDocs(q);
      let books = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id as any,
          ...data,
          viewUrl: data.viewUrl || data.view_url,
          downloadUrl: data.downloadUrl || data.download_url,
          coverImageUrl: data.coverImageUrl || data.cover_image_url,
          publishedYear: data.publishedYear || data.published_year,
        } as Book;
      });

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
