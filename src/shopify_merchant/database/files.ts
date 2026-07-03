/**
 * Files Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface AssetFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: string;
  mimeType: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_FILES_DATA: AssetFile[] = [
  {
    id: 'file_001',
    name: 'atlantic_editorial_cover.jpg',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    type: 'image',
    size: '1.2 MB',
    mimeType: 'image/jpeg',
    status: 'active',
    createdAt: '2026-06-16T10:00:00Z',
    updatedAt: '2026-06-16T10:00:00Z'
  },
  {
    id: 'file_002',
    name: 'sartorial_silhouette.jpg',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    type: 'image',
    size: '840 KB',
    mimeType: 'image/jpeg',
    status: 'active',
    createdAt: '2026-06-16T11:30:00Z',
    updatedAt: '2026-06-16T11:30:00Z'
  },
  {
    id: 'file_003',
    name: 'product_dimension_spec.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'document',
    size: '142 KB',
    mimeType: 'application/pdf',
    status: 'active',
    createdAt: '2026-06-15T09:12:00Z',
    updatedAt: '2026-06-15T09:12:00Z'
  }
];
