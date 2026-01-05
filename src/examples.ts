import { CacheHandler } from './cacheHandler';

/**
 * Example usage of the CacheHandler
 */

// Example 1: Simple string data
async function exampleStringCache() {
  const fetcher = async () => {
    console.log('Fetching string data...');
    return 'Hello, World!';
  };

  const result = await CacheHandler('example:string', fetcher, 60);
  console.log('Result:', result);
}

// Example 2: Object data
interface User {
  id: number;
  name: string;
  email: string;
}

async function exampleObjectCache() {
  const fetchUser = async (): Promise<User> => {
    console.log('Fetching user data...');
    // Simulate API call
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
  };

  const user = await CacheHandler<User>('user:1', fetchUser, 3600);
  console.log('User:', user);
}

// Example 3: Array data
async function exampleArrayCache() {
  const fetchItems = async () => {
    console.log('Fetching items...');
    return [1, 2, 3, 4, 5];
  };

  const items = await CacheHandler('items:list', fetchItems, 300);
  console.log('Items:', items);
}

// Example 4: API call with error handling
async function exampleApiCache() {
  const fetchApiData = async () => {
    console.log('Making API call...');
    // Simulate API call that might fail
    const response = { data: 'API Response', timestamp: Date.now() };
    return response;
  };

  try {
    const data = await CacheHandler('api:data', fetchApiData, 1800);
    console.log('API Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run examples
async function runExamples() {
  console.log('=== CacheHandler Examples ===\n');

  console.log('Example 1: String Cache');
  await exampleStringCache();
  console.log('');

  console.log('Example 2: Object Cache');
  await exampleObjectCache();
  console.log('');

  console.log('Example 3: Array Cache');
  await exampleArrayCache();
  console.log('');

  console.log('Example 4: API Cache');
  await exampleApiCache();
  console.log('');

  console.log('=== Examples Complete ===');
}

// Uncomment to run examples
// runExamples().catch(console.error);
