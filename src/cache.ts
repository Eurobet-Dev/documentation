import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

/**
 * Cache class for handling Redis operations
 */
export class Cache {
  private static instance: Cache | null = null;
  private client: RedisClientType | null = null;
  private connecting: Promise<RedisClientType> | null = null;

  private constructor() {
    this.client = null;
  }

  /**
   * Get singleton instance of Cache
   */
  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * Initialize Redis connection
   */
  private async ensureConnection(): Promise<RedisClientType> {
    if (this.client && this.client.isOpen) {
      return this.client;
    }

    // If already connecting, wait for the existing connection attempt
    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = this.createConnection();
    try {
      this.client = await this.connecting;
      return this.client;
    } finally {
      this.connecting = null;
    }
  }

  /**
   * Create a new Redis connection
   */
  private async createConnection(): Promise<RedisClientType> {
    try {
      const client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      }) as RedisClientType;

      client.on('error', (err) => {
        logger.error(`Redis Client Error: ${err}`);
      });

      await client.connect();
      return client;
    } catch (error) {
      logger.error(`Failed to connect to Redis: ${error}`);
      throw error;
    }
  }

  /**
   * Get value from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.ensureConnection();
      const value = await client.get(key);
      
      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting cache key '${key}': ${error}`);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param options Cache options (e.g., { EX: ttl })
   */
  async set<T>(key: string, value: T, options?: { EX?: number }): Promise<void> {
    try {
      const client = await this.ensureConnection();
      const serialized = JSON.stringify(value);
      
      if (options?.EX) {
        await client.setEx(key, options.EX, serialized);
      } else {
        await client.set(key, serialized);
      }
    } catch (error) {
      logger.error(`Error setting cache key '${key}': ${error}`);
      throw error;
    }
  }

  /**
   * Close Redis connection
   */
  async close(): Promise<void> {
    if (this.client && this.client.isOpen) {
      await this.client.quit();
      this.client = null;
    }
  }
}
