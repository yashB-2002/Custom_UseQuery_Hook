import { useEffect, useState } from "react";

const defObj = () => {};

// object to keep default configuration for useQuery hook like staletime,cachetime
const defaultConfig = {
  staleTime: 0,
  onSuccess: defObj,
  onError: defObj,
};

// cache to keep cached data
const cache = new Map();

const useCustomQuery = ({ queryKey, queryFn, config = defaultConfig }) => {
  config = { ...defaultConfig, ...config }; 

  const [state, setState] = useState({
    data: null,
    isLoading: true,
    isSuccess: false,
    isError: false,
    error: "",
  });
  const { onSuccess, onError, staleTime } = config;

  const cacheKey = JSON.stringify(queryKey);
  const cachedData = cache.get(cacheKey);

  // check data in cache is valid or not based on staletime
  const isCacheValid = cachedData && (Date.now() - cachedData.timestamp < staleTime);

  // this function executes the queryfetching thing in the hook
  const execQuery = () => {

    // if cache is valid then setState with the cache data only
    if (isCacheValid) {
      setState({
        data: cachedData.data,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: "",
      });
      return;
    }

    setState((s) => ({ ...s, isLoading: true }));

    // execute the query function for getting the data from network api request
    queryFn()
      .then((data) => {
        setState({
          data,
          isLoading: false,
          isSuccess: true,
          isError: false,
          error: "",
        });
        cache.set(cacheKey, { data, timestamp: Date.now() });
        onSuccess(data);
      })
      // handle if any error occured 
      .catch((error) => {
        setState({
          data: null,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: error.message || "Failed to fetch",
        });
        onError(error);
      });
  };

  // whenever the cache key changes the data also changes
  useEffect(execQuery, [cacheKey]);

  return { ...state, refetch: execQuery };
};

export default useCustomQuery;
