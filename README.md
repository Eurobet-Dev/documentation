# Cache Handler Documentation

A TypeScript-based cache handler implementation with Redis support and automatic fallback functionality.

## Overview

This package provides a robust caching solution with the following features:
- Redis-based caching with automatic connection management
- Graceful error handling with fallback to data fetcher
- Type-safe TypeScript implementation
- Configurable TTL (Time To Live) for cached entries

## Installation

```bash
npm install
```

## Configuration

Set the Redis connection URL via environment variable:

```bash
export REDIS_URL=redis://localhost:6379
```

If not set, it defaults to `redis://localhost:6379`.

## Usage

### Basic Example

```typescript
import { CacheHandler } from './src/cacheHandler';

// Example fetcher function
const fetchUserData = async () => {
  const response = await fetch('https://api.example.com/user/123');
  return response.json();
};

// Use the cache handler
const userData = await CacheHandler(
  'user:123',           // Cache key
  fetchUserData,        // Fetcher function
  3600                  // TTL in seconds (1 hour)
);
```

### How It Works

The `CacheHandler` function follows this flow:

1. **Check Cache**: First, it attempts to retrieve data from Redis using the provided key
2. **Return Cached**: If data exists in cache, it returns immediately
3. **Fetch Fresh**: If cache miss, it calls the `fetcher` function to get fresh data
4. **Store in Cache**: The fresh data is stored in Redis with the specified TTL
5. **Error Fallback**: If any error occurs during caching operations, it falls back to calling the fetcher directly

### API Reference

#### CacheHandler

```typescript
const CacheHandler = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number
): Promise<T>
```

**Parameters:**
- `key`: Unique identifier for the cached data
- `fetcher`: Async function that retrieves the data when cache misses
- `ttl`: Time to live in seconds for the cached entry

**Returns:** Promise that resolves to the cached or fetched data

#### Cache Class

```typescript
class Cache {
  async get<T>(key: string): Promise<T | null>
  async set<T>(key: string, value: T, options?: { EX?: number }): Promise<void>
  async close(): Promise<void>
}
```

**Methods:**
- `get<T>(key)`: Retrieve value from cache, returns null if not found
- `set<T>(key, value, options)`: Store value in cache with optional TTL
- `close()`: Close Redis connection

## Building

```bash
npm run build
```

This compiles TypeScript files from `src/` to `dist/`.

## Project Structure

```
.
├── src/
│   ├── cache.ts          # Redis cache implementation
│   ├── cacheHandler.ts   # Main cache handler function
│   ├── logger.ts         # Logging utility
│   └── index.ts          # Package exports
├── dist/                 # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The cache handler includes robust error handling:
- If Redis operations fail, it logs the error and falls back to the fetcher
- Connection errors are automatically handled
- Data serialization/deserialization errors are caught and logged

## License

MIT