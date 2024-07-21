import './App.css';
import useCustomMutation from './hooks/useCustomMutation';
import useProducts from './hooks/useProducts';

function App() {

  // data retrieved from useProducts hook
  const { isLoading, isError, error, data } = useProducts();

    // useMutuation hook usage for post request
    const mutation = useCustomMutation(async () => {
      const response = await fetch(`https://fakestoreapi.com/products`, {
        method: "POST",
        body: JSON.stringify({
          title: 'New Product',
          price: 200,
          description: 'This is new product.',
          image: 'https://i.pravatar.cc',
          category: 'clothing',
        }),
      });
      const json = await response.json();
      return json;
    }, {
      onSuccess: (data) => console.log(data),
      onError: (error) => console.error(error)
    });
  
    // to check whether data is in loading state or error state
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
  
    if (isError) {
      return <h1>{error}</h1>;
    }
  
    return (
      <>
        {
          mutation.isLoading ? <p>Adding Product...</p> :
            (
              <>
                {
                  mutation.isError ? <p>{mutation.error}</p> : null
                }
                <button onClick={() => mutation.mutate()}>Add Product</button>
                {mutation.isSuccess && <p>Product added...</p>}
              </>
            )
        }

        {/* div to showcase the products on web page */}
        <div className='products'>
          {
            data.map(product => {
              return (
                <div key={product.id} className='product'>
                  <img src={product.image} alt={product.title} />
                  <h3>{product.title}</h3>
                  <p>{product.price}</p>
                </div>
              );
            })
          }
        </div>
      </>
    );
}

export default App;
