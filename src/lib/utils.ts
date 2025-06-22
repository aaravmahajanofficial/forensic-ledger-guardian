/**
 * Shared utility functions for common operations throughout the application
 *
 * @module Lib/Utils
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logError } from "@/utils/logger";

/**
 * Merges and resolves Tailwind CSS classes without conflicts
 *
 * @param inputs - The class values to merge
 * @returns A string of merged CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Safely parses JSON without throwing exceptions
 *
 * @param jsonString - The JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns The parsed object or the fallback value
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined,
  fallback: T
): T {
  if (!jsonString) return fallback;

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logError(
      "Failed to parse JSON",
      { stringLength: jsonString?.length },
      error instanceof Error ? error : new Error("JSON parse error")
    );
    return fallback;
  }
}

/**
 * Debounces a function to limit how often it can be called
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Creates a deep copy of an object
 *
 * @param obj - The object to clone
 * @returns A deep copy of the object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    logError(
      "Failed to deep clone object",
      {},
      error instanceof Error ? error : new Error("Clone failed")
    );
    // Fallback to a shallow copy
    return { ...obj };
  }
}

/**
 * Creates a promise that resolves after the specified time
 *
 * @param ms - Time to wait in milliseconds
 * @returns A promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
