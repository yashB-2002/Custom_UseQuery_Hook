import useCustomQuery from './useCustomQuery';


// function to fetch the all products from the api request
const useProducts = () => {
  const fetchProducts = async () => {
    const products = await fetch(`https://fakestoreapi.com/products`);
    const data = await products.json();
    return data;
  }

  const { data, isLoading, isError, error, refetch } = useCustomQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    config: { staleTime: 10000 },
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export default useProducts;
