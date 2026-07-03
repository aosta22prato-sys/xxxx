import { Segment } from '../types';
import { INITIAL_SEGMENTS } from '../database/segments';

export class SegmentService {
  static async getSegments(): Promise<Segment[]> {
    const stored = localStorage.getItem('shopify_mock_segments');
    if (stored) return JSON.parse(stored);
    
    // Fallback seed
    localStorage.setItem('shopify_mock_segments', JSON.stringify(INITIAL_SEGMENTS));
    return INITIAL_SEGMENTS;
  }

  static async saveSegments(segments: Segment[]): Promise<boolean> {
    localStorage.setItem('shopify_mock_segments', JSON.stringify(segments));
    return true;
  }
}
