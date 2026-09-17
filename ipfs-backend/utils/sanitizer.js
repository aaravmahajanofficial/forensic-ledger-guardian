// General text input sanitizer (strips angle brackets, quotes, and control characters)
export function sanitizeInput(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/[<>"'\r\n\x00-\x1F\x7F]/g, "")
    .trim();
}

// Log sanitizer to prevent log injection vulnerabilities
export function sanitizeLog(str) {
  if (typeof str !== "string") return String(str || "");
  return encodeURIComponent(str.replace(/[\r\n\x00-\x1F\x7F]/g, ""));
}
