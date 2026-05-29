import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductCategory } from '../models/product.model';

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=600&h=800&fit=crop&crop=top&q=85&auto=format`;

const MOCK_PRODUCTS: Product[] = [
  // CASQUETTES
  {
    id: 'cap-001', name: 'Diamond Cap Kente Gold', category: 'casquettes',
    price: 15000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Or', hex: '#C9A96E' }, { name: 'Noir', hex: '#0D0D0D' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviewCount: 124,
    imageUrl: IMG('photo-1588850561407-ed78c282e89b'),
    gradient: 'linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)',
    accentColor: '#C9A96E', icon: '🧢',
    description: 'Casquette premium inspirée du tissu Kente. Broderie dorée signature Diamond Wear.',
    tags: ['kente', 'gold', 'premium']
  },
  {
    id: 'cap-002', name: 'Snapback Wax Orange', category: 'casquettes',
    price: 12000, originalPrice: 16000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }, { name: 'Blanc', hex: '#FFFFFF' }],
    sizes: ['M', 'L', 'XL'], rating: 4.6, reviewCount: 89,
    imageUrl: IMG('photo-1556306535-0f09a537f0a3'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #C45A0F 100%)',
    accentColor: '#E8772A', icon: '🧢',
    description: 'Snapback avec motif wax africain. Style streetwear moderne.',
    tags: ['wax', 'orange', 'streetwear']
  },
  {
    id: 'cap-003', name: 'Diamond Snapback Black', category: 'casquettes',
    price: 18000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Orange', hex: '#E8772A' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.9, reviewCount: 201,
    imageUrl: IMG('photo-1521369909029-2afed882baee'),
    gradient: 'linear-gradient(135deg, #1C1B2E 0%, #0D0D0D 100%)',
    accentColor: '#0D0D0D', icon: '🧢',
    description: 'Le classique noir Diamond Wear. Logo brodé signature en orange.',
    tags: ['black', 'classic', 'logo']
  },
  {
    id: 'cap-004', name: 'Cap African Art', category: 'casquettes',
    price: 14000, isNew: false, isFeatured: false, inStock: false,
    colors: [{ name: 'Marron', hex: '#8B4513' }, { name: 'Crème', hex: '#F5F0EB' }],
    sizes: ['M', 'L'], rating: 4.5, reviewCount: 67,
    imageUrl: IMG('photo-1637370426863-3a92087ae5f6'),
    gradient: 'linear-gradient(135deg, #8B4513 0%, #5C2D0A 100%)',
    accentColor: '#8B4513', icon: '🧢',
    description: 'Art africain contemporain sur casquette. Pièce unique et artistique.',
    tags: ['art', 'african', 'unique']
  },
  // BONNETS
  {
    id: 'bon-001', name: 'Bonnet Diamond Classic', category: 'bonnets',
    price: 8000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Gris', hex: '#6B6B6B' }],
    sizes: ['Unique'], rating: 4.7, reviewCount: 156,
    imageUrl: IMG('photo-1626131522159-fd77ba01b8ba'),
    gradient: 'linear-gradient(135deg, #2C2C2C 0%, #0D0D0D 100%)',
    accentColor: '#2C2C2C', icon: '🎩',
    description: 'Bonnet en laine premium avec logo Diamond Wear brodé.',
    tags: ['wool', 'winter', 'classic']
  },
  {
    id: 'bon-002', name: 'Bonnet Kente Colors', category: 'bonnets',
    price: 10000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Multicolore', hex: '#E8772A' }],
    sizes: ['Unique'], rating: 4.8, reviewCount: 88,
    imageUrl: IMG('photo-1609743522653-52354461eb27'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #1C1B2E 50%, #C9A96E 100%)',
    accentColor: '#E8772A', icon: '🎩',
    description: 'Bonnet aux couleurs vives inspirées du tissu Kente traditionnel.',
    tags: ['kente', 'colorful', 'traditional']
  },
  {
    id: 'bon-003', name: 'Bonnet Premium Navy', category: 'bonnets',
    price: 9000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Marine', hex: '#1C1B2E' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['Unique'], rating: 4.6, reviewCount: 73,
    imageUrl: IMG('photo-1761662864935-15b9036af722'),
    gradient: 'linear-gradient(135deg, #1C1B2E 0%, #0A0918 100%)',
    accentColor: '#1C1B2E', icon: '🎩',
    description: 'Bonnet luxe marine et or. Finition premium.',
    tags: ['navy', 'luxury', 'gold']
  },
  // T-SHIRTS
  {
    id: 'tee-001', name: 'Tee Diamond Logo Orange', category: 'tshirts',
    price: 18000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }, { name: 'Blanc', hex: '#FFFFFF' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, reviewCount: 342,
    imageUrl: IMG('photo-1594736797933-d0501ba2fe65'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #B85D18 100%)',
    accentColor: '#E8772A', icon: '👕',
    description: 'Le t-shirt signature Diamond Wear. 100% coton bio, coupe oversize.',
    tags: ['logo', 'orange', 'oversize', 'bio']
  },
  {
    id: 'tee-002', name: 'Tee African Print White', category: 'tshirts',
    price: 20000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Crème', hex: '#F5F0EB' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 198,
    imageUrl: IMG('photo-1573497019940-1c28c88b4f3e'),
    gradient: 'linear-gradient(135deg, #F5F0EB 0%, #E8E0D5 100%)',
    accentColor: '#F5F0EB', icon: '👕',
    description: 'Imprimé africain contemporain sur fond blanc. Art et mode fusionnés.',
    tags: ['print', 'white', 'art', 'african']
  },
  {
    id: 'tee-003', name: 'Tee Oversize Black Logo', category: 'tshirts',
    price: 22000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.8, reviewCount: 267,
    imageUrl: IMG('photo-1761660896938-95ea6219cae8'),
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
    accentColor: '#0D0D0D', icon: '👕',
    description: 'Oversize drop shoulder. Logo D-Wear en relief. Incontournable.',
    tags: ['black', 'oversize', 'logo', 'drop-shoulder']
  },
  {
    id: 'tee-004', name: 'Tee Kente Lines Navy', category: 'tshirts',
    price: 19000, originalPrice: 24000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Marine', hex: '#1C1B2E' }, { name: 'Orange', hex: '#E8772A' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.5, reviewCount: 143,
    imageUrl: IMG('photo-1585311289599-43be5425e921'),
    gradient: 'linear-gradient(135deg, #1C1B2E 0%, #2D2C4A 100%)',
    accentColor: '#1C1B2E', icon: '👕',
    description: 'Lignes Kente sur base marine. Harmonie entre tradition et modernité.',
    tags: ['kente', 'navy', 'lines']
  },
  {
    id: 'tee-005', name: 'Tee Premium Gold Edition', category: 'tshirts',
    price: 25000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Or', hex: '#C9A96E' }, { name: 'Noir', hex: '#0D0D0D' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 5.0, reviewCount: 87,
    imageUrl: IMG('photo-1603208636259-4bf3d6589c63'),
    gradient: 'linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)',
    accentColor: '#C9A96E', icon: '👕',
    description: 'Édition limitée Gold. Impression or sur coton premium egyptien.',
    tags: ['gold', 'limited', 'premium', 'egyptian-cotton']
  },
  {
    id: 'tee-006', name: 'Tee Wax Graphic Orange', category: 'tshirts',
    price: 21000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }, { name: 'Marron', hex: '#8B4513' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.6, reviewCount: 112,
    imageUrl: IMG('photo-1579710754366-bb9665344096'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #8B4513 100%)',
    accentColor: '#E8772A', icon: '👕',
    description: 'Graphic tee avec motif wax africain original. Couleurs chaudes.',
    tags: ['wax', 'graphic', 'warm-colors']
  },
  // MANCHES LONGUES
  {
    id: 'ml-001', name: 'ML Diamond Stripes', category: 'manches-longues',
    price: 25000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Orange', hex: '#E8772A' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 134,
    imageUrl: IMG('photo-1754653099086-3bddb9346d37'),
    gradient: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #E8772A 100%)',
    accentColor: '#0D0D0D', icon: '👔',
    description: 'Manche longue avec rayures signature Diamond Wear. Style intemporel.',
    tags: ['stripes', 'black', 'orange', 'timeless']
  },
  {
    id: 'ml-002', name: 'ML Wax Classic Navy', category: 'manches-longues',
    price: 23000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Marine', hex: '#1C1B2E' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'], rating: 4.6, reviewCount: 98,
    imageUrl: IMG('photo-1696962701419-6f510910e838'),
    gradient: 'linear-gradient(135deg, #1C1B2E 0%, #2D2C4A 100%)',
    accentColor: '#1C1B2E', icon: '👔',
    description: 'Classique marine avec finitions dorées. Élégant en toute circonstance.',
    tags: ['navy', 'gold', 'classic', 'elegant']
  },
  {
    id: 'ml-003', name: 'ML African Lines Black', category: 'manches-longues',
    price: 24000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviewCount: 76,
    imageUrl: IMG('photo-1770283556410-426d250b4196'),
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
    accentColor: '#0D0D0D', icon: '👔',
    description: 'Motifs de lignes africaines brodés sur manchettes. Prestige assuré.',
    tags: ['african', 'lines', 'black', 'embroidery']
  },
  {
    id: 'ml-004', name: 'ML Premium Orange', category: 'manches-longues',
    price: 26000, originalPrice: 32000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, reviewCount: 155,
    imageUrl: IMG('photo-1773864930571-9c77b59b3270'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #C45A0F 100%)',
    accentColor: '#E8772A', icon: '👔',
    description: 'Mono-couleur orange signature. Logo ton sur ton. Audacieux.',
    tags: ['orange', 'bold', 'tonal', 'premium']
  },
  // PULLS
  {
    id: 'pul-001', name: 'Hoodie Diamond Black', category: 'pulls',
    price: 35000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Orange', hex: '#E8772A' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 4.9, reviewCount: 445,
    imageUrl: IMG('photo-1648320397369-85ab3fa368bc'),
    gradient: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
    accentColor: '#0D0D0D', icon: '🧥',
    description: 'Le hoodie iconique Diamond Wear. Molleton 400g ultra-doux.',
    tags: ['hoodie', 'black', 'premium', 'fleece']
  },
  {
    id: 'pul-002', name: 'Sweat Kente Orange', category: 'pulls',
    price: 32000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 213,
    imageUrl: IMG('photo-1637370426939-e3221ea49baa'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #C9A96E 100%)',
    accentColor: '#E8772A', icon: '🧥',
    description: 'Sweatshirt Kente Orange. Motifs tissés directement dans le tissu.',
    tags: ['kente', 'orange', 'woven', 'unique']
  },
  {
    id: 'pul-003', name: 'Pull African Art Cream', category: 'pulls',
    price: 38000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Crème', hex: '#F5F0EB' }, { name: 'Marron', hex: '#8B4513' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviewCount: 167,
    imageUrl: IMG('photo-1628375385883-6e086364f66d'),
    gradient: 'linear-gradient(135deg, #F5F0EB 0%, #E8E0D5 100%)',
    accentColor: '#F5F0EB', icon: '🧥',
    description: 'Pull en laine mérinos crème avec broderies art africain. Luxe raffiné.',
    tags: ['merino', 'cream', 'art', 'embroidery', 'luxury']
  },
  // TENUES AFRICAINES
  {
    id: 'afr-001', name: 'Boubou Prestige D-Wear', category: 'tenues-africaines',
    price: 75000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Or', hex: '#C9A96E' }, { name: 'Blanc', hex: '#FFFFFF' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], rating: 5.0, reviewCount: 89,
    imageUrl: IMG('photo-1776880471112-708c211e6a4b'),
    gradient: 'linear-gradient(135deg, #C9A96E 0%, #8B6914 50%, #C9A96E 100%)',
    accentColor: '#C9A96E', icon: '👘',
    description: 'Grand boubou prestige brodé main. Broderies dorées sur tissu bazin riche.',
    tags: ['boubou', 'gold', 'handmade', 'bazin', 'prestige']
  },
  {
    id: 'afr-002', name: 'Dashiki Diamond Edition', category: 'tenues-africaines',
    price: 55000, originalPrice: 70000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Orange', hex: '#E8772A' }, { name: 'Multicolore', hex: '#C9A96E' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, reviewCount: 134,
    imageUrl: IMG('photo-1617293851568-bac1f3af7e09'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #C9A96E 50%, #1C1B2E 100%)',
    accentColor: '#E8772A', icon: '👘',
    description: 'Dashiki réinterprété par Diamond Wear. Fusion tradition et contemporain.',
    tags: ['dashiki', 'orange', 'modern', 'fusion']
  },
  {
    id: 'afr-003', name: 'Agbada Royal Black Gold', category: 'tenues-africaines',
    price: 95000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Noir', hex: '#0D0D0D' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['M', 'L', 'XL', 'XXL'], rating: 5.0, reviewCount: 56,
    imageUrl: IMG('photo-1622923384269-3136683ed170'),
    gradient: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #C9A96E 100%)',
    accentColor: '#C9A96E', icon: '👘',
    description: 'Agbada royal noir et or. Le summum de l\'élégance africaine.',
    tags: ['agbada', 'black', 'gold', 'royal', 'luxury']
  },
  {
    id: 'afr-004', name: 'Kaftan Wax Premium', category: 'tenues-africaines',
    price: 65000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Multicolore', hex: '#E8772A' }],
    sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, reviewCount: 78,
    imageUrl: IMG('photo-1556452576-3e2d58536f62'),
    gradient: 'linear-gradient(135deg, #8B4513 0%, #E8772A 50%, #C9A96E 100%)',
    accentColor: '#E8772A', icon: '👘',
    description: 'Kaftan en tissu wax 100% africain. Confection artisanale de qualité.',
    tags: ['kaftan', 'wax', 'artisanal']
  },
  {
    id: 'afr-005', name: 'Set Bazin Diamond', category: 'tenues-africaines',
    price: 85000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Marine', hex: '#1C1B2E' }, { name: 'Or', hex: '#C9A96E' }],
    sizes: ['M', 'L', 'XL'], rating: 4.9, reviewCount: 112,
    imageUrl: IMG('photo-1630494693052-5bef2683bcaa'),
    gradient: 'linear-gradient(135deg, #1C1B2E 0%, #2D2C4A 50%, #C9A96E 100%)',
    accentColor: '#1C1B2E', icon: '👘',
    description: 'Ensemble 3 pièces en bazin riche. Broderies diamant signature.',
    tags: ['bazin', 'navy', 'gold', '3-piece', 'diamond']
  },
  // CHAUSSURES
  {
    id: 'sho-001', name: 'Sneakers Diamond White', category: 'chaussures',
    price: 45000, isNew: true, isFeatured: true, inStock: true,
    colors: [{ name: 'Blanc', hex: '#FFFFFF' }, { name: 'Orange', hex: '#E8772A' }],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'], rating: 4.8, reviewCount: 234,
    imageUrl: IMG('photo-1542291026-7eec264c27ff'),
    gradient: 'linear-gradient(135deg, #F5F0EB 0%, #FFFFFF 100%)',
    accentColor: '#FFFFFF', icon: '👟',
    description: 'Sneakers signature blanc avec swoosh Diamond. Semelle orange.',
    tags: ['sneakers', 'white', 'orange', 'casual']
  },
  {
    id: 'sho-002', name: 'Boots African Craft', category: 'chaussures',
    price: 55000, isNew: false, isFeatured: true, inStock: true,
    colors: [{ name: 'Marron', hex: '#8B4513' }, { name: 'Noir', hex: '#0D0D0D' }],
    sizes: ['39', '40', '41', '42', '43', '44'], rating: 4.7, reviewCount: 167,
    imageUrl: IMG('photo-1595388710140-e7b90300ec73'),
    gradient: 'linear-gradient(135deg, #8B4513 0%, #5C2D0A 100%)',
    accentColor: '#8B4513', icon: '👟',
    description: 'Boots en cuir véritable artisanat africain. Gravures traditionnelles.',
    tags: ['boots', 'leather', 'craft', 'artisanal']
  },
  {
    id: 'sho-003', name: 'Mocassins Premium Gold', category: 'chaussures',
    price: 42000, originalPrice: 52000, isNew: false, isFeatured: false, inStock: true,
    colors: [{ name: 'Or', hex: '#C9A96E' }, { name: 'Marron', hex: '#8B4513' }],
    sizes: ['38', '39', '40', '41', '42', '43'], rating: 4.6, reviewCount: 98,
    imageUrl: IMG('photo-1531310197839-ccf54634509e'),
    gradient: 'linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)',
    accentColor: '#C9A96E', icon: '👟',
    description: 'Mocassins en cuir doré. Finitions artisanales africaines. Classe absolue.',
    tags: ['moccasin', 'gold', 'leather', 'class']
  },
  {
    id: 'sho-004', name: 'Sneakers Kente Edition', category: 'chaussures',
    price: 48000, isNew: true, isFeatured: false, inStock: true,
    colors: [{ name: 'Multicolore', hex: '#E8772A' }, { name: 'Noir', hex: '#0D0D0D' }],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'], rating: 4.9, reviewCount: 189,
    imageUrl: IMG('photo-1600269452121-4f2416e55c28'),
    gradient: 'linear-gradient(135deg, #E8772A 0%, #1C1B2E 50%, #C9A96E 100%)',
    accentColor: '#E8772A', icon: '👟',
    description: 'Édition Kente limitée. Tige en tissu wax traditionnel sur semelle noire.',
    tags: ['kente', 'limited', 'wax', 'colorful']
  }
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(MOCK_PRODUCTS);
  private readonly _searchQuery = signal('');
  private readonly _selectedCategory = signal<ProductCategory | 'all'>('all');

  readonly products = this._products.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();

  readonly filteredProducts = computed(() => {
    let list = this._products();
    const cat = this._selectedCategory();
    const q = this._searchQuery().toLowerCase();
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (q) list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
    return list;
  });

  readonly featuredProducts = computed(() =>
    this._products().filter(p => p.isFeatured).slice(0, 8)
  );

  readonly newProducts = computed(() =>
    this._products().filter(p => p.isNew).slice(0, 4)
  );

  getById(id: string): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  getByCategory(category: ProductCategory): Product[] {
    return this._products().filter(p => p.category === category);
  }

  setCategory(cat: ProductCategory | 'all'): void {
    this._selectedCategory.set(cat);
  }

  setSearch(q: string): void {
    this._searchQuery.set(q);
  }
}
