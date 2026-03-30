
export type UserRole = 'admin' | 'viewer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: any;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  coverImageUrl?: string;
  publishedYear?: number;
  viewUrl?: string;
  downloadUrl?: string;
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
