/* eslint-disable no-console */
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const useAxiosFetch = (url: string, timeout: number) => {
  const [data, setData] = useState<AxiosResponse | null>(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {        
    let unmounted = false;
    const source = axios.CancelToken.source();    
    axios
      .get(url, {
        cancelToken: source.token,
        timeout,
      })
      .then(a => {
        if (!unmounted) {
          setData(a);
          setLoading(false);          
        }
      })
      .catch(function(e) {
        if (!unmounted) {
          setError(true);
          setErrorMessage(e.message);
          setLoading(false);
          if (axios.isCancel(e)) {            
            console.log(`request cancelled:${e.message}`);
          } else {
            console.log("another error happened:" + e.message);
          }
        }
      });

    return function() {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [timeout, url]);
  
  return { data, loading, error, errorMessage };
};

export default useAxiosFetch;