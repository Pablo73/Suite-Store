import axios from 'axios';
import { handleResponse } from './handleResponse';
import Cookies from 'js-cookie';

const baseUrl = 'http://localhost';

export const fetchData = async (url, setData, setIsLoading, headers) => {
  try {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/${url}`, {
      method: 'GET',
      headers: headers
    });
    const data = await handleResponse(response);
    setData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};

export const postData = async (url, data, headers, callback, navigate, location) => {
  try {
    const response = await axios.post(`${baseUrl}/${url}`, data, { headers });
    if (callback) {
      callback(response.data);
    }
  } catch (error) {
    console.log(error)
    handleApiError(error, navigate, location);
  }
};

export const deleteData = async (url, data, headers, callback, navigate, location) => {
  try {
    const response = await axios.delete(`${baseUrl}/${url}`, { data, headers });
    if (callback) {
      callback(response.data);
    }
  } catch (error) {
    console.log(error)
    handleApiError(error, navigate, location);
  }
};

const handleApiError = (error, navigate, location) => {
  if (error.response && error.response.status === 401) {
    alert('Invalid user or expired token.');
    sessionStorage.removeItem('token');
    Cookies.remove('userRole');
    navigate('/');
    throw new Error('Unauthorized');

  } else if (error.response && error.response.status === 403) {
    alert('You do not have the required role to perform this action.');
    throw new Error('Permission denied');

  } else if (error.response && error.response.status === 500) {
    alert('Already registered user.');
    throw new Error('User already registered');

  } else {
    throw error;
  }
};
