import { useState } from "react";

const defObj = () => {};
const defaultConfig = {
  onSuccess: defObj,
  onError: defObj,
};

const useCustomMutation = (mutationFn, config = defaultConfig) => {
  config = { ...defaultConfig, ...config }; 


  // state to keep track of variable returned by original useMutation hook
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  });

  // destructred callbacks from config obj
  const { onSuccess, onError } = config;

  // function mutate actually calls the api
  const mutate = async (variables) => {

    // setting initial state when api is executing
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: "",
    });
    try {
      const data = await mutationFn(variables); // api is called with the post data

      // suucess operation which sets the state variables
      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: "",
      });

      // onsucess callback is called with data recieved from the network call
      onSuccess(data);
    } catch (error) {
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: error.message || "Failed to mutate",
      });
      onError(error);
    }
  };

  // return type of the useMutation hook is state variables and mutate function
  return { ...state, mutate };
};

export default useCustomMutation;
