/**
 * Metaobjects Database Slot
 * Compliant with AI Permanent Constitution: Table Layer
 */

export interface MetafieldDefinition {
  key: string;
  name: string;
  type: 'single_line_text_field' | 'multi_line_text_field' | 'number' | 'boolean' | 'json';
  description?: string;
  required: boolean;
}

export interface Metaobject {
  id: string;
  name: string; // e.g. 'Size Chart Specification'
  handle: string; // e.g. 'size_chart_spec'
  description?: string;
  status: 'active' | 'draft' | 'archived';
  fields: MetafieldDefinition[];
  entries: {
    id: string;
    status: 'active' | 'draft' | 'archived';
    values: Record<string, any>; // mapping of key -> value
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const INITIAL_METAOBJECTS_DATA: Metaobject[] = [
  {
    id: 'meta_leather_info',
    name: 'Bespoke Premium Materials',
    handle: 'bespoke_materials',
    description: 'Detailed specifications for premium organic materials used in product details lists.',
    status: 'active',
    fields: [
      { key: 'material_name', name: 'Material Name', type: 'single_line_text_field', required: true },
      { key: 'origin_region', name: 'Origin Region', type: 'single_line_text_field', required: true },
      { key: 'durability_grade', name: 'Durability Grade', type: 'single_line_text_field', required: false },
      { key: 'care_instructions', name: 'Care Instructions', type: 'multi_line_text_field', required: false }
    ],
    entries: [
      {
        id: 'entry_001',
        status: 'active',
        values: {
          material_name: 'Full-Grain Calfskin Leather',
          origin_region: 'Tuscany, Italy',
          durability_grade: 'Grade A+ (Lifetime Wear)',
          care_instructions: 'Keep in ventilated dark wardrobes. Polish monthly with specialized organic oils.'
        },
        createdAt: '2026-06-16T12:00:00Z',
        updatedAt: '2026-06-16T12:00:00Z'
      },
      {
        id: 'entry_002',
        status: 'active',
        values: {
          material_name: 'Architectural Llama Wool fibers',
          origin_region: 'Andes, Peru',
          durability_grade: 'Grade Premium Soft',
          care_instructions: 'Dry clean only. Gentle steaming to restore silhouettes.'
        },
        createdAt: '2026-06-16T13:10:00Z',
        updatedAt: '2026-06-16T13:10:00Z'
      }
    ],
    createdAt: '2026-06-16T10:00:00Z',
    updatedAt: '2026-06-16T13:10:00Z'
  }
];
