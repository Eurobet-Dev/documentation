/**
 * Simple logger utility for cache operations
 */
class Logger {
  error(message: string): void {
    console.error(message);
  }

  info(message: string): void {
    console.info(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  debug(message: string): void {
    console.debug(message);
  }
}

export const logger = new Logger();
