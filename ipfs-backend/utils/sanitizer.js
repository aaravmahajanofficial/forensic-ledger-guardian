// General text input sanitizer
export function sanitizeInput(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip control characters
    .trim();
}
