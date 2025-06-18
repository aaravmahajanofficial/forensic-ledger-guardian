/**
 * Enhanced logging utility for the Forensic Ledger Guardian
 * Provides structured logging with different levels, formatting, and transport options
 *
 * @module Utils/Logger
 */

import { LOG_LEVELS, LOG_LEVEL_LABELS } from "@/constants";

// Use the constants for log levels
export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

/**
 * Log entry structure representing a single log record
 */
export interface LogEntry {
  /** ISO timestamp of the log */
  timestamp: string;

  /** Log level */
  level: LogLevel;

  /** Log category/source */
  category?: string;

  /** Log message */
  message: string;

  /** Additional context data */
  context?: Record<string, any>;

  /** Associated error object */
  error?: Error;

  /** User ID if authenticated */
  userId?: string;

  /** Session ID */
  sessionId?: string;
}

/**
 * Available log transport types
 */
export enum LogTransportType {
  Console = "console",
  LocalStorage = "localStorage",
  RemoteApi = "remoteApi",
}

/**
 * Log transport interface for sending logs to different destinations
 */
export interface LogTransport {
  /** Transport type */
  type: LogTransportType;

  /** Send a log entry to the transport destination */
  send: (entry: LogEntry) => void;

  /** Flush any buffered logs (if applicable) */
  flush?: () => Promise<void>;
}

/**
 * Console log transport implementation
 */
class ConsoleTransport implements LogTransport {
  public type = LogTransportType.Console;

  /**
   * Send log to console with appropriate styling
   */
  public send(entry: LogEntry): void {
    const { level, message, context, error, category } = entry;

    // Format the message with timestamp and level prefix
    const prefix = `[${entry.timestamp}] [${LOG_LEVEL_LABELS[level]}]${
      category ? ` [${category}]` : ""
    }`;

    // Select appropriate console method based on level
    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(`${prefix} ${message}`, context || "", error || "");
        break;
      case LOG_LEVELS.WARN:
        console.warn(`${prefix} ${message}`, context || "");
        break;
      case LOG_LEVELS.INFO:
        console.info(`${prefix} ${message}`, context || "");
        break;
      case LOG_LEVELS.DEBUG:
        console.debug(`${prefix} ${message}`, context || "");
        break;
      default:
        console.log(`${prefix} ${message}`, context || "");
    }
  }
}

/**
 * LocalStorage log transport implementation
 */
class LocalStorageTransport implements LogTransport {
  public type = LogTransportType.LocalStorage;
  private readonly maxEntries: number;
  private readonly storageKey: string;

  constructor(storageKey = "flg_logs", maxEntries = 100) {
    this.storageKey = storageKey;
    this.maxEntries = maxEntries;
  }

  /**
   * Store log entry in localStorage with rotation
   */
  public send(entry: LogEntry): void {
    try {
      // Only run in browser environment
      if (typeof localStorage === "undefined") return;

      // Get existing logs
      const existingLogs = this.getStoredLogs();

      // Add new log entry
      existingLogs.push(entry);

      // Trim if exceeds max entries
      if (existingLogs.length > this.maxEntries) {
        existingLogs.splice(0, existingLogs.length - this.maxEntries);
      }

      // Store updated logs
      localStorage.setItem(this.storageKey, JSON.stringify(existingLogs));
    } catch (error) {
      // Fail silently to avoid recursion
      console.error("Failed to store log in localStorage", error);
    }
  }

  /**
   * Get stored logs from localStorage
   */
  public getStoredLogs(): LogEntry[] {
    try {
      const storedLogs = localStorage.getItem(this.storageKey);
      return storedLogs ? JSON.parse(storedLogs) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  public clearLogs(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error("Failed to clear logs from localStorage", error);
    }
  }
}

/**
 * Enhanced logger with multiple transports and configurable behavior
 */
class Logger {
  /** Current log level */
  private logLevel: LogLevel;

  /** Whether in development mode */
  private isDevelopment: boolean;

  /** Log transports */
  private transports: LogTransport[];

  /**
   * Create a new logger instance
   */
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.logLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
    this.transports = [new ConsoleTransport()];

    // Add localStorage in browser environment
    if (typeof window !== "undefined") {
      this.transports.push(new LocalStorageTransport());

      // Expose logger globally for debugging
      if (this.isDevelopment) {
        (window as any).forensicLogger = {
          debug: (message: string, data?: Record<string, any>) =>
            this.debug(message, data),
          info: (message: string, data?: Record<string, any>) =>
            this.info(message, data),
          warn: (message: string, data?: Record<string, any>) =>
            this.warn(message, data),
          error: (message: string, data?: Record<string, any>, error?: Error) =>
            this.error(message, data, error),
        };
      }
    }
  }

  /**
   * Determine if a log level should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  /**
   * Set the log level dynamically
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get stored logs from all transports
   */
  public getLogs(): LogEntry[] {
    // Currently, only implement for localStorage transport
    for (const transport of this.transports) {
      if (transport.type === LogTransportType.LocalStorage) {
        return (transport as LocalStorageTransport).getStoredLogs();
      }
    }
    return [];
  }

  /**
   * Clear all stored logs
   */
  public clearLogs(): void {
    // Currently, only implement for localStorage transport
    for (const transport of this.transports) {
      if (transport.type === LogTransportType.LocalStorage) {
        (transport as LocalStorageTransport).clearLogs();
      }
    }
  }

  /**
   * Log a message with specified level
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    category?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      category,
    };

    // Send to all transports
    for (const transport of this.transports) {
      transport.send(logEntry);
    }
  }

  /**
   * Log an error message
   */
  public error(
    message: string,
    context?: Record<string, any>,
    error?: Error,
    category?: string
  ): void {
    this.log(LOG_LEVELS.ERROR, message, context, error, category);
  }

  /**
   * Log a warning message
   */
  public warn(
    message: string,
    context?: Record<string, any>,
    category?: string
  ): void {
    this.log(LOG_LEVELS.WARN, message, context, undefined, category);
  }

  /**
   * Log an info message
   */
  public info(
    message: string,
    context?: Record<string, any>,
    category?: string
  ): void {
    this.log(LOG_LEVELS.INFO, message, context, undefined, category);
  }

  /**
   * Log a debug message
   */
  public debug(
    message: string,
    context?: Record<string, any>,
    category?: string
  ): void {
    this.log(LOG_LEVELS.DEBUG, message, context, undefined, category);
  }

  /**
   * Log a security-related event (always logged)
   */
  public logSecurity(message: string, context?: Record<string, any>): void {
    this.log(LOG_LEVELS.WARN, message, context, undefined, "SECURITY");
  }

  /**
   * Log an audit event (important actions)
   */
  public logAudit(action: string, context?: Record<string, any>): void {
    this.log(LOG_LEVELS.INFO, `AUDIT: ${action}`, context, undefined, "AUDIT");
  }

  /**
   * Log a performance metric
   */
  public logPerformance(
    operation: string,
    durationMs: number,
    context?: Record<string, any>
  ): void {
    this.log(
      LOG_LEVELS.DEBUG,
      `PERF: ${operation} - ${durationMs}ms`,
      { ...context, durationMs },
      undefined,
      "PERFORMANCE"
    );
  }
}

// Create singleton logger instance
const logger = new Logger();

// Export utility functions for easier usage
export const logDebug = (
  message: string,
  context?: Record<string, any>,
  category?: string
): void => logger.debug(message, context, category);

export const logInfo = (
  message: string,
  context?: Record<string, any>,
  category?: string
): void => logger.info(message, context, category);

export const logWarn = (
  message: string,
  context?: Record<string, any>,
  category?: string
): void => logger.warn(message, context, category);

export const logError = (
  message: string,
  context?: Record<string, any>,
  error?: Error,
  category?: string
): void => logger.error(message, context, error, category);

export const logSecurityEvent = (
  message: string,
  context?: Record<string, any>
): void => logger.logSecurity(message, context);

export const logAudit = (action: string, context?: Record<string, any>): void =>
  logger.logAudit(action, context);

export const logPerformance = (
  operation: string,
  durationMs: number,
  context?: Record<string, any>
): void => logger.logPerformance(operation, durationMs, context);

// Export the logger for direct usage
export default logger;
