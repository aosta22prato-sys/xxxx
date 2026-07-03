/**
 * Themes Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface ThemeConfig {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'archived';
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headerStyle: 'inline' | 'centered' | 'minimal';
  footerLayout: 'simple' | 'extended';
  footerText: string;
  enableSlider: boolean;
  sliderBanners: {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_THEME_DATA: ThemeConfig[] = [
  {
    id: 'theme_atlantic_noir',
    name: 'Atlantic Noir (Active)',
    status: 'active',
    logoUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&q=80',
    primaryColor: '#111111',
    accentColor: '#4f46e5',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    headerStyle: 'inline',
    footerLayout: 'simple',
    footerText: '© 2026 Atelier Noir Co. All rights reserved.',
    enableSlider: true,
    sliderBanners: [
      {
        id: 'banner_1',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80',
        title: 'Autumn Editorial Leather Essentials',
        subtitle: 'Crafted in the heart of Brussels by master artisans.',
        buttonText: 'Explore Catalog',
        buttonLink: '#products',
      },
      {
        id: 'banner_2',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
        title: 'Sartorial Expressionism',
        subtitle: 'Modern silhouettes with architectural focus.',
        buttonText: 'View Collection',
        buttonLink: '#collections',
      }
    ],
    createdAt: '2026-06-16T12:00:00Z',
    updatedAt: '2026-06-17T02:00:00Z'
  },
  {
    id: 'theme_claudio_warm',
    name: 'Sartorial Warmth (Draft)',
    status: 'draft',
    logoUrl: '',
    primaryColor: '#5c4033',
    accentColor: '#d97706',
    backgroundColor: '#fdfbfa',
    textColor: '#3e2723',
    headerStyle: 'centered',
    footerLayout: 'extended',
    footerText: '© 2026 Atelier Noir. Bespoke Commerce Solutions.',
    enableSlider: false,
    sliderBanners: [],
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-06-15T15:00:00Z'
  },
  {
    id: 'theme_tinker_pottery',
    name: 'Tinker Craft (Draft)',
    status: 'draft',
    logoUrl: '',
    primaryColor: '#b45309',
    accentColor: '#059669',
    backgroundColor: '#fafaf9',
    textColor: '#44403c',
    headerStyle: 'inline',
    footerLayout: 'simple',
    footerText: '© 2026 Tinker Handmade Pottery. All rights reserved.',
    enableSlider: true,
    sliderBanners: [
      {
        id: 'banner_tinker_1',
        imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&q=80',
        title: 'Minimal Clay Cookware',
        subtitle: 'Wheel-thrown stoneware made for everyday home cooking.',
        buttonText: 'Acquire Collection',
        buttonLink: '#products',
      }
    ],
    createdAt: '2026-06-14T09:00:00Z',
    updatedAt: '2026-06-14T11:00:00Z'
  },
  {
    id: 'theme_savor_food',
    name: 'Savor Gourmet (Draft)',
    status: 'draft',
    logoUrl: '',
    primaryColor: '#dc2626',
    accentColor: '#1e3a8a',
    backgroundColor: '#fffcfc',
    textColor: '#1a0505',
    headerStyle: 'minimal',
    footerLayout: 'simple',
    footerText: '© 2026 Savor Restaurant & Culinary Studio.',
    enableSlider: true,
    sliderBanners: [
      {
        id: 'banner_savor_1',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
        title: 'Fresh Gastronomy Journeys',
        subtitle: 'Artisanal recipes and cold-pressed organic extracts.',
        buttonText: 'Order Catering',
        buttonLink: '#orders',
      }
    ],
    createdAt: '2026-06-13T08:00:00Z',
    updatedAt: '2026-06-13T12:00:00Z'
  },
  {
    id: 'theme_nebula_glow',
    name: 'Nebula Cyber (Draft)',
    status: 'draft',
    logoUrl: '',
    primaryColor: '#9333ea',
    accentColor: '#ec4899',
    backgroundColor: '#090514',
    textColor: '#e8d5ff',
    headerStyle: 'inline',
    footerLayout: 'extended',
    footerText: '© 2026 Nebula Systems. Engineering the Outer Rim.',
    enableSlider: true,
    sliderBanners: [
      {
        id: 'banner_nebula_1',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
        title: 'Quantum Computing Terminals',
        subtitle: 'Anodized aluminum interfaces with mechanical keywells.',
        buttonText: 'Assemble Build',
        buttonLink: '#specs',
      }
    ],
    createdAt: '2026-06-12T07:00:00Z',
    updatedAt: '2026-06-12T10:00:00Z'
  }
];
