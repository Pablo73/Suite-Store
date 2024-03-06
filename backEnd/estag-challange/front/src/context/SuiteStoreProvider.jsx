import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import SuiteStoreContext from './SuiteStoreContext';

import { fetchData } from '../utils/apiUtils';

function SuiteStoreProvider({ children }) {

    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const CATEGORY_GET_ALL_URL = 'http://localhost/category/allCategory';
    const PRODUCT_GET_ALL_URL = 'http://localhost/product/allProduct';
    const ORDER_GET_ALL_URL = 'http://localhost/order/allOrder';

    const fetchConfigurations = [
        { url: CATEGORY_GET_ALL_URL, setData: setCategoryData },
        { url: PRODUCT_GET_ALL_URL, setData: setProductData },
        { url: ORDER_GET_ALL_URL, setData: setOrderData },
    ];

    useEffect(() => {
        fetchConfigurations.forEach(async ({ url, setData }) => {
          await fetchData(url, setData, setIsLoading);
        });
      }, [fetchConfigurations]);

  const value = useMemo(() => ({
    categoryData,
    productData,
    orderData,
    isLoading,
  }), [
    categoryData,
    productData,
    orderData,
    isLoading,
  ]);

  return (
    <SuiteStoreContext.Provider value={value}>
      {children}
    </SuiteStoreContext.Provider>
  );
};

SuiteStoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default SuiteStoreProvider;