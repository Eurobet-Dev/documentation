import { Cache } from './cache';
import { logger } from './logger';

/**
 * Cache handler function that manages caching logic with fallback
 * @param key Cache key
 * @param fetcher Function to fetch data if not in cache
 * @param ttl Time to live in seconds
 * @returns Cached or fetched data
 */
export const CacheHandler = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T> => {
  try {
    const cache = new Cache();
    const cached = await cache.get<T>(key);

    if (cached) {
      return cached;
    }

    const data = await fetcher();

    cache.set(key, data, { EX: ttl });
    return data;
  } catch (error) {
    logger.error(`[CacheHandler] Error in cache handler for key '${key}': ${error}`);
    return await fetcher();
  }
};
