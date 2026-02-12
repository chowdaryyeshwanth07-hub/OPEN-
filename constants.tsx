
import React from 'react';
import { Book } from './types.ts';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    categories: ["Classic", "Fiction"],
    coverImageUrl: "https://picsum.photos/seed/gatsby/400/600",
    publishedYear: 1925,
    createdAt: Date.now() - 1000000
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    categories: ["Classic", "Drama"],
    coverImageUrl: "https://picsum.photos/seed/mockingbird/400/600",
    publishedYear: 1960,
    createdAt: Date.now() - 2000000
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about ubiquitous government surveillance.",
    categories: ["Dystopian", "Political"],
    coverImageUrl: "https://picsum.photos/seed/1984/400/600",
    publishedYear: 1949,
    createdAt: Date.now() - 3000000
  },
  {
    id: 4,
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A novel that explores a dystopian future where genetically engineered humans and social hierarchy define society.",
    categories: ["Sci-Fi", "Dystopian"],
    coverImageUrl: "https://picsum.photos/seed/brave/400/600",
    publishedYear: 1932,
    createdAt: Date.now() - 4000000
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about the quest of home-loving hobbit Bilbo Baggins to win a share of the treasure guarded by a dragon.",
    categories: ["Fantasy", "Adventure"],
    coverImageUrl: "https://picsum.photos/seed/hobbit/400/600",
    publishedYear: 1937,
    createdAt: Date.now() - 5000000
  },
  {
    id: 6,
    title: "Moby Dick",
    author: "Herman Melville",
    description: "The sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick.",
    categories: ["Classic", "Adventure"],
    coverImageUrl: "https://picsum.photos/seed/moby/400/600",
    publishedYear: 1851,
    createdAt: Date.now() - 6000000
  }
];

export const CATEGORIES = [
  "Classic", "Fiction", "Drama", "Dystopian", "Political", "Sci-Fi", "Fantasy", "Adventure", "Philosophy", "History"
];
