// cacheUtils.js
import cache from 'memory-cache';

export const fetchDataWithCache = async (cacheKey, fetchDataFromServer) => {
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  } else {
    const newData = await fetchDataFromServer();
    cache.put(cacheKey, newData, 3600 * 1000); // Cache for 1 hour
    return newData;
  }
};
