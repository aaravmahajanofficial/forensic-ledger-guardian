/**
 * Logger Utility
 * Simple logging interface for the application
 */

export interface LogEvent {
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
  timestamp?: Date;
}

// Simple console-based logger implementation
export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, context || {});
  },
  warn: (message: string, context?: Record<string, unknown>) => {
     
    console.warn(`[WARN] ${message}`, context || {});
  },
  error: (
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ) => {
    console.error(`[ERROR] ${message}`, { ...context, error: error?.message });
  },
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, context || {});
    }
  },
};

// Convenience functions for specific log types
export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info(message, context);
};

export const logWarn = (message: string, context?: Record<string, unknown>) => {
  logger.warn(message, context);
};

export const logError = (
  message: string,
  context?: Record<string, unknown>,
  error?: Error
) => {
  logger.error(message, context, error);
};

export const logDebug = (
  message: string,
  context?: Record<string, unknown>
) => {
  logger.debug(message, context);
};

// Security-specific logging
export const logSecurityEvent = (
  message: string,
  context?: Record<string, unknown>
) => {
  logger.warn(`[SECURITY] ${message}`, context);
};

// Audit logging
export const logAudit = (
  message: string,
  context?: Record<string, unknown>
) => {
  logger.info(`[AUDIT] ${message}`, context);
};

// Performance logging
export const logPerformance = (
message: string, p0?: number, context?: Record<string, unknown>) => {
  logger.debug(`[PERFORMANCE] ${message}`, context);
};

export default logger;
