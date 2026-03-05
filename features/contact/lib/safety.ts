export function safeJson<T>(value: unknown): T | null {
  try {
    return value as T;
  } catch {
    return null;
  }
}

