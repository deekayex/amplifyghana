import cache from 'memory-cache';

export const fetchDataWithCache = async (cacheKey, fetchDataFromServer) => {
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  } else {
    try {
      const newData = await fetchDataFromServer();
      cache.put(cacheKey, newData, 3600 * 1000); // Cache for 1 hour
      return newData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to handle it at a higher level if needed
    }
  }
};
