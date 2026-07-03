import { create } from 'zustand';
import { Segment } from '../types';
import { INITIAL_SEGMENTS } from '../database/segments';

interface SegmentState {
  segments: Segment[];
  setSegments: (segments: Segment[]) => void;
  addSegment: (segment: Segment) => void;
  updateSegment: (id: string, updated: Partial<Segment>) => void;
  deleteSegment: (id: string) => void;
}

const getStoredSegments = (): Segment[] => {
  const saved = localStorage.getItem('shopify_mock_segments');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return INITIAL_SEGMENTS;
};

export const useSegmentStore = create<SegmentState>((set, get) => ({
  segments: getStoredSegments(),
  setSegments: (segments) => {
    set({ segments });
    localStorage.setItem('shopify_mock_segments', JSON.stringify(segments));
  },
  addSegment: (segment) => {
    const updated = [segment, ...get().segments];
    set({ segments: updated });
    localStorage.setItem('shopify_mock_segments', JSON.stringify(updated));
  },
  updateSegment: (id, updated) => {
    const updatedList = get().segments.map((s) =>
      s.id === id ? { ...s, ...updated } : s
    );
    set({ segments: updatedList });
    localStorage.setItem('shopify_mock_segments', JSON.stringify(updatedList));
  },
  deleteSegment: (id) => {
    const updatedList = get().segments.filter((s) => s.id !== id);
    set({ segments: updatedList });
    localStorage.setItem('shopify_mock_segments', JSON.stringify(updatedList));
  },
}));
