
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  coverImageUrl?: string;
  publishedYear?: number;
  createdAt: any;
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
