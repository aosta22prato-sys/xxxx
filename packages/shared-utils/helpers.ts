/**
 * Shared Utils helpers
 */

export function generateUUID(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
