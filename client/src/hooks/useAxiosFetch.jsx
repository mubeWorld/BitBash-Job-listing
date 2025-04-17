import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function useAxiosFetch(url, config = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url,config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url,config);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, config]);

  useEffect(() => {
    fetchData(url,config);
  }, []);

  return [ data,setData, loading, error, fetchData ];
}

export default useAxiosFetch;
