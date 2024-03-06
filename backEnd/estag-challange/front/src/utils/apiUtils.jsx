import { handleResponse } from './handleResponse';

export const fetchData = async (url, setData, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await fetch(url);
    const data = await handleResponse(response);
    setData(data);
  } catch (error) {
    console.error('Error in fetch request:', error);
  } finally {
    setIsLoading(false);
  }
};
