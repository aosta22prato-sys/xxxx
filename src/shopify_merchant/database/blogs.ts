/**
 * Blog Posts Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImageUrl?: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_BLOGS_DATA: BlogPost[] = [
  {
    id: 'blog_001',
    title: 'The Architecture of Full-Grain Italian Leather',
    slug: 'architecture-full-grain-leather',
    excerpt: 'An inquiry into custom processing methods, durability profiles, and natural finishes from Italian tanneries.',
    content: '<h2>Introduction to Full-Grain</h2><p>Full-grain leather is prized for its completely natural surface, showing every micro-texture and telling a story of craftsmanship. In this guide, we discuss why organic finishes survive century-long wears...</p>',
    author: 'Claudio Noir',
    coverImageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    status: 'active',
    createdAt: '2026-06-15T14:30:00Z',
    updatedAt: '2026-06-16T10:00:00Z'
  },
  {
    id: 'blog_002',
    title: 'Bespoke tailoring: Hand stitching vs Machine Stitching',
    slug: 'hand-tailoring-machine-stitch',
    excerpt: 'A delicate comparison of mechanical tension versus human pacing in heritage blazer construction.',
    content: '<h2>The Hand Stitch</h2><p>Hand-sewn garments have organic adjustments built right into every stitch, allowing fabrics to flow naturally along human dimensions...</p>',
    author: 'Elena Rousseau',
    coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    status: 'active',
    createdAt: '2026-06-14T11:00:00Z',
    updatedAt: '2026-06-14T11:00:00Z'
  }
];
