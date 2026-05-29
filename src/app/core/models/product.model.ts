export type ProductCategory =
  | 'casquettes'
  | 'bonnets'
  | 'tshirts'
  | 'manches-longues'
  | 'pulls'
  | 'tenues-africaines'
  | 'chaussures';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  tags: string[];
  isNew: boolean;
  isFeatured: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  gradient: string;
  accentColor: string;
  icon: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  'casquettes': 'Casquettes',
  'bonnets': 'Bonnets',
  'tshirts': 'T-Shirts',
  'manches-longues': 'Manches Longues',
  'pulls': 'Pulls & Hoodies',
  'tenues-africaines': 'Tenues Africaines',
  'chaussures': 'Chaussures'
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  'casquettes': '🧢',
  'bonnets': '🎩',
  'tshirts': '👕',
  'manches-longues': '👔',
  'pulls': '🧥',
  'tenues-africaines': '👘',
  'chaussures': '👟'
};
