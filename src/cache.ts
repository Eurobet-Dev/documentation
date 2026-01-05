import { createClient, RedisClientType } from 'redis';

/**
 * Cache class for handling Redis operations
 */
export class Cache {
  private client: RedisClientType | null = null;

  constructor() {
    this.client = null;
  }

  /**
   * Initialize Redis connection
   */
  private async ensureConnection(): Promise<RedisClientType> {
    if (!this.client) {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.client.on('error', (err) => {
        console.error('Redis Client Error', err);
      });

      await this.client.connect();
    }

    if (!this.client.isOpen) {
      await this.client.connect();
    }

    return this.client;
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
      console.error(`Error getting cache key '${key}':`, error);
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
      console.error(`Error setting cache key '${key}':`, error);
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
