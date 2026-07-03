export function safeJsonParse<T = any>(value: string | null | undefined, defaultValue: T = null as T): T {
  if (value === null || value === undefined || value.trim() === '') {
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(value);
    
    // Special case: if parsed is 'undefined' string (from localStorage.setItem('key', undefined)), return defaultValue
    if (parsed === 'undefined' || parsed === undefined) {
      return defaultValue;
    }

    return parsed;
  } catch (error) {
    console.warn('[safeJsonParse] Failed to parse JSON:', value, error);
    return defaultValue;
  }
}
