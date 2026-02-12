
export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  categories: string[];
  coverImageUrl?: string;
  publishedYear?: number;
  createdAt: number;
}

export enum SortOption {
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  TITLE_ASC = 'TITLE_ASC',
  TITLE_DESC = 'TITLE_DESC'
}

export interface LibraryState {
  books: Book[];
  nextId: number;
}
