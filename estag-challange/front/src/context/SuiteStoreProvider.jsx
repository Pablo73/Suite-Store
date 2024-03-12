import React, { useEffect, useMemo, useState } from 'react';
import SuiteStoreContext from './SuiteStoreContext';
import { fetchData } from '../utils/apiUtils';
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from '../utils/apiUtils';
import Cookies from 'js-cookie';


function SuiteStoreProvider({ children }) {

  const location = useLocation();
  const navigate = useNavigate();

    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [allOrderData, setAllOrderData] = useState([]);
    const [userData, setuserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = sessionStorage.getItem('token');

    const CATEGORY_GET_ALL_URL = 'category/allCategory';
    const PRODUCT_GET_ALL_URL = 'product/allProduct';
    const ORDER_GET_ALL_URL = 'order/allOrder';
    const USER_GET_ALL_URL = 'user';

    const header = { 
      'Content-Type': 'application/json',
      'Authorization': token
     };

    const fetchConfigurations = [
        { url: CATEGORY_GET_ALL_URL, setData: setCategoryData, headers: header },
        { url: PRODUCT_GET_ALL_URL, setData: setProductData, headers: header },
        { url: ORDER_GET_ALL_URL, setData: setAllOrderData, headers: header },
        { url: USER_GET_ALL_URL, setData: setuserData, headers: header },
    ];

    useEffect(() => {
      const fetchDataAsyncOrder = async () => {
        try {
          if (token) {
            for (const { url, setData, headers } of fetchConfigurations) {
              await fetchData(url, setData, setIsLoading, headers);
            }
          }
        } catch (error) {
          console.error('Error in API call:', error.message);
        }
      };
    
      fetchDataAsyncOrder();
    }, [location.pathname]); 


    useEffect(() => {
      const fetchDataAsync = async () => {
        const token = sessionStorage.getItem('token');
    
        try {
          if (token) {
            const url = 'user/role';
            const headers = { 
              'Content-Type': 'application/json',
              'Authorization': token
            };
    
            await postData(url, null, headers, handleApiResponseRole, navigate, location);
          }
        } catch (error) {
          console.error('Error in API call:', error.message);
        }
      };
    
      fetchDataAsync();
    }, [location.pathname]); 
  
  const handleApiResponseRole = (response) => {
    if (response.status === 200 && response.message) {
      try {
        const parsedResponse = JSON.parse(response.message);
        const role = parsedResponse.role;
        Cookies.set('userRole', role);
  
      } catch (error) {
        console.error('Error parsing response:', error.message);
      }
    } else {
      console.error('Invalid response:', response);
    }
  };

  const value = useMemo(() => ({
    categoryData,
    productData,
    isLoading,
    setCategoryData,
    setProductData,
    allOrderData,
    userData,
  }), [
    categoryData,
    productData,
    isLoading,
    allOrderData,
    userData,
  ]);

  return (
    <SuiteStoreContext.Provider value={value}>
      {children}
    </SuiteStoreContext.Provider>
  );
};

export default SuiteStoreProvider;