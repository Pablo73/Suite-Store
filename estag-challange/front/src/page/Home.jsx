import React, { useContext, useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import SuiteStoreContext from '../context/SuiteStoreContext';
import SelectComponent from '../components/SelectComponent';
import addQuantityPerProduct from '../utils/addQuantityPerProduct';
import { postData } from '../utils/apiUtils';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem('token');
  const [taxData, setTaxData] = useState("");
  const [priceData, setPriceData] = useState("");
  const [allPurchases, setAllPurchases] = useState([]);
  const [totalShoppingCart, setTotalShoppingCart] = useState({
    totalPrice: 0,
    totalTax: 0
  });

  const columns = ['Product', 'Price', 'Amount', 'Total']

  const getAllPurchaset = JSON.parse(localStorage.getItem('purchase')) || [];

  const { productData } = useContext(SuiteStoreContext) ?? { productData: [] };

  const [newPurchasetData, setNewPurchasetData] = useState({
    amount: '',
    nameProduct : '',
    taxValueHome: '',
    unitPriceHome: '',
    availableQuantity:'',
    tax: '',
    total: ''
  });

  const handleButtonDeletePurchaset = (rowIndex) => {
    const newArray = getAllPurchaset.filter((_, i) => i !== rowIndex);
    localStorage.setItem('purchase', JSON.stringify(newArray));
    updateTableData();
  };
  
  const addButtonPurchaset = () => {

    if (!newPurchasetData.nameProduct 
      || !newPurchasetData.amount) {
      alert('Please enter a value to register.');
      return;
    }

    if (newPurchasetData.nameProduct.trim() === '') {
      alert('Please enter a value to register.');
      return;
    }

    const existingPurchase = JSON.parse(localStorage.getItem('purchase')) || [];
    existingPurchase.push(newPurchasetData);
    localStorage.setItem('purchase', JSON.stringify(existingPurchase));
    window.location.reload(true);
    addQuantityPerProduct(newPurchasetData.nameProduct, Number(newPurchasetData.availableQuantity));
    updateTableData();
  };

  const addAllProductsShoppingCart = () => {
    const allPurchases = JSON.parse(localStorage.getItem('purchase')) || [];

    const totalTax = allPurchases.reduce((acc, purchase) => acc + Number(purchase.tax), 0);
    const totalPrice = allPurchases.reduce((acc, purchase) => acc + Number(purchase.total), 0);

    setTotalShoppingCart({
      totalTax: Number(totalTax.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),
    });
    
}
  
  const updateTableData = () => {
    const allPurchases = JSON.parse(localStorage.getItem('purchase')) || [];
    setAllPurchases(allPurchases);
    addAllProductsShoppingCart ();
  };

  useEffect(() => {
    const allPurchases = JSON.parse(localStorage.getItem('purchase')) || [];
    setAllPurchases(allPurchases);
    addAllProductsShoppingCart ();
  }, []);

  const handlePurchasetChange = (name, value) => {

    setNewPurchasetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'amount') {
      setNewPurchasetData((prevData) => {
        const selectedProduct = productData.message.find((product) => product.products_name === prevData.nameProduct);

        if (selectedProduct) {
          setTaxData(selectedProduct.tax);
          setPriceData(selectedProduct.unit_price);

          const convertPriceNumber = Number(selectedProduct.unit_price);
          const convertTaxNumber = Number(selectedProduct.tax);
          const convertAmount = Number(value);

          const valuePrice = convertPriceNumber * convertAmount;
          const taxValueMoney = (convertPriceNumber / 100) * convertTaxNumber;
          const priceTotalItem = valuePrice + taxValueMoney;

          return {
            ...prevData,
            taxValueHome: Number(selectedProduct.tax),
            unitPriceHome: Number(selectedProduct.unit_price),
            availableQuantity: Number(selectedProduct.product_amount),
            tax: Number(taxValueMoney.toFixed(2)),
            total: Number(priceTotalItem.toFixed(2)),
          };
        }
        return prevData;
      });
    }

    if (name === 'nameProduct') {
      setNewPurchasetData((prevData) => {
        const selectedProduct = productData.message.find((product) => product.products_name === prevData.nameProduct);

        if (selectedProduct) {
          setTaxData(selectedProduct.tax);
          setPriceData(selectedProduct.unit_price);
        }
        return prevData;
      });
    }
  };

  const finshbutton = () => {

    const finshPurchaset = async () => {
      const allPurchases = JSON.parse(localStorage.getItem('purchase')) || [];

      if (!allPurchases || allPurchases.length === 0) {
        alert('Please enter a value to register.');
        return;
      }
      try {
        const url = 'order/total';
        const headers = { 
          'Content-Type': 'application/json',
          'Authorization': token
         };
  
        await postData(url, totalShoppingCart, headers, handleApiResponseFinsh, navigate, location);
  
      } catch (error) {
        console.error('Error in API call:', error.message);
      }
    };
  
    const handleApiResponseFinsh = (response) => {
      if (response.status === 201 && response.message.success) {
        
        const handleButtonClickItem = async () => {
          try {
            const url = 'order/item';
            const headers = { 
              'Content-Type': 'application/json',
              'Authorization': token
             };

             const orderId = response.message.lastInsertedId;
      
             const  newObjectRequest  = {
                  objectPurchase: allPurchases,
                  orderId: orderId,
              }
      
            await postData(url, newObjectRequest, headers, handleApiResponseItem, navigate, location);
      
          } catch (error) {
            console.error('Error in API call:', error.message);
          }
        };
      
        const handleApiResponseItem = (response) => {
          if (response.status === 201 && response.message) {
            cancelButton();
          } 
        };
        handleButtonClickItem();
      } 
    };
    finshPurchaset();
  }

  const cancelButton = () => {
    localStorage.removeItem('purchase');
    window.location.reload();
  }

  return (
    <div>
      <Header/>
      <div className="container-all-data">
        <div className="input-data">
                <SelectComponent
                  className="select-home"
                  label="Product"
                  id="productHome"
                  options={productData.message}
                  onChange={(e) => handlePurchasetChange('nameProduct', e.target.value)}
                  keyValue="products_name"
                />
                <div className="input-home">
                    <Input 
                    label="Amount:" 
                    id="amountHome" 
                    type="number" 
                    className="input-field"
                    onChange={(e) => handlePurchasetChange('amount', e.target.value)}/>
                  <Input  label="Tax:"
                    id="taxValueHome"
                    type="text"
                    value={`${taxData}%`}
                    className="input-field"
                    disabled
                    onChange={(e) => handlePurchasetChange('taxValueHome', e.target.value)}/>
                  <Input  label="Price:"
                    id="unitPriceHome"
                    type="text"
                    value={`$${priceData}`}
                    className="input-field"
                    disabled
                    onChange={(e) => handlePurchasetChange('unitPriceHome', e.target.value)}/>
                </div>
                <Button 
                id="add-product-home" 
                className="insert-data" 
                name="Add Product"
                type="button"
                onClick={addButtonPurchaset}/>
        </div>
        <hr className="line-between-sectors"></hr>
        <div className="data">
            <table id="tableCategory">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {getAllPurchaset.map((row, rowIndex) => {
              return (
                <tr key={`${rowIndex}: ${row}`}>
                  <td>{row.nameProduct}</td>
                  <td>{`$${row.unitPriceHome}`}</td>
                  <td>{row.amount}</td>
                  <td>{`$${row.total}`}</td>
                  <td>
                    <button onClick={() => handleButtonDeletePurchaset(rowIndex)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="result-data">
        <Input
          label="Tax:"
          id="taxHome"
          type="text"
          value={`$${totalShoppingCart ? totalShoppingCart.totalTax.toFixed(2) : "0.00"}`}
          className="tax-home"
          disabled
          onChange={() => {}}
        />
        <Input
          label="Total:"
          id="totalHome"
          type="text"
          value={`$${totalShoppingCart ? totalShoppingCart.totalPrice.toFixed(2) : "0.00"}`}
          className="tax-home"
          disabled
          onChange={() => {}}
        />
        <div className="button-finish">
        <Button 
              id="cancel-home" 
              name="Cancel" 
              type="button"
              onClick={cancelButton}/>
          <Button 
              id="finish-home" 
              name="Finish" 
              type="button"
              onClick={finshbutton}/>
        </div>
        </div>   
        </div>
      </div>
    </div>
  );
}

export default Home;