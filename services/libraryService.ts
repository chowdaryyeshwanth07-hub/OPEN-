
import { Book, SortOption } from '../types.ts';
import { supabase } from '../supabase.ts';

export const libraryService = {
  getAllBooks: async (): Promise<Book[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('poems') // Using 'poems' as requested by the user
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) {
      console.error('Error fetching poems:', error);
      return [];
    }
    return data || [];
  },

  getBook: async (id: number): Promise<Book | undefined> => {
    if (!supabase) return undefined;
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching poem:', error);
      return undefined;
    }
    return data;
  },

  addBook: async (book: Omit<Book, 'id' | 'createdAt'>): Promise<Book | null> => {
    if (!supabase) return null;
    const newBook = {
      ...book,
      createdAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('poems')
      .insert([newBook])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding poem:', error);
      return null;
    }
    return data;
  },

  updateBook: async (id: number, updated: Partial<Book>): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('poems')
      .update(updated)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating poem:', error);
      return false;
    }
    return true;
  },

  deleteBook: async (id: number): Promise<boolean> => {
    if (!supabase) return false;
    const { error } = await supabase
      .from('poems')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting poem:', error);
      return false;
    }
    return true;
  },

  searchAndFilter: async (keyword: string, category: string, sort: SortOption): Promise<Book[]> => {
    if (!supabase) return [];
    let query = supabase.from('poems').select('*');

    if (keyword) {
      const lower = keyword.toLowerCase();
      query = query.or(`title.ilike.%${lower}%,author.ilike.%${lower}%,description.ilike.%${lower}%`);
    }

    if (category && category !== 'All') {
      query = query.contains('categories', [category]);
    }

    switch (sort) {
      case SortOption.NEWEST:
        query = query.order('createdAt', { ascending: false });
        break;
      case SortOption.OLDEST:
        query = query.order('createdAt', { ascending: true });
        break;
      case SortOption.TITLE_ASC:
        query = query.order('title', { ascending: true });
        break;
      case SortOption.TITLE_DESC:
        query = query.order('title', { ascending: false });
        break;
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error searching poems:', error);
      return [];
    }
    return data || [];
  }
};
