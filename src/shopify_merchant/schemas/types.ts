export interface SchemaFieldMeta {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'tags' | 'price' | 'status';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface SchemaColumnMeta {
  key: string;
  label: string;
  type: 'text' | 'number' | 'badge' | 'currency' | 'date' | 'items-count';
  sortable?: boolean;
}
