import React, { useContext, useState } from 'react';
import Header from '../components/Header/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import SuiteStoreContext from '../context/SuiteStoreContext';
import SelectComponent from '../components/SelectComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import { deleteData, postData } from '../utils/apiUtils';


function Product() {

  const navigate = useNavigate();
  const location = useLocation();
  const columns = ['Product', 'Code', 'Amount', 'Unit Price', 'Category']
  const { productData } = useContext(SuiteStoreContext) ?? { productData: [] };
  const { categoryData } = useContext(SuiteStoreContext) ?? { categoryData: [] };
  const token = sessionStorage.getItem('token');
  const { fetchDataAsyncOrder } = useContext(SuiteStoreContext);

  const [newProductData, setNewProductData] = useState({
    name : '',
    amount: '',
    price: '',
    nameCategory: ''
  });

  const handleInputChange = (name, value) => {
    setNewProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleButtonDeleteProduct = async (rowData) => {
    try {
      const url = 'product/delete';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

       const requestBody = {
        name: rowData.products_name
    };

      await deleteData(url, requestBody, headers, handleApiResponseDelete, navigate, location);

    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponseDelete = (response) => {
    if (response.status === 200 && response.message) {
      console.log(response.message)
      fetchDataAsyncOrder();
    } 
  };

  const addButtonProduct = async () => {
    try {

      if (!newProductData.name 
        || !newProductData.amount
        || !newProductData.price
        || !newProductData.nameCategory) {
        alert('Please enter a value to register.');
        return;
      }
      const url = 'product/insert';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

      const test = await postData(url, newProductData, headers, handleApiResponseNew, navigate, location);
    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponseNew = (response) => {
    if (response.status === 201 && response.message) {
      fetchDataAsyncOrder();
    }  
  }
  return (
    <div>
       <Header/>
      <div className="container-all-data">
        <div className="input-data">
            <form>
                <div className="input-home">
                  <div>
                    <Input 
                    label="Product name:" 
                    id="productName" 
                    type="text" 
                    className="input-field"
                    onChange={(e) => handleInputChange('name', e.target.value)}/>
                  </div>
                  <div>
                  <Input 
                  label="Amount:" 
                  id="unitPriceProduct" 
                  type="number" 
                  className="input-field"
                  onChange={(e) => handleInputChange('amount', e.target.value)}/>
                  </div>
                  <div>
                  <Input 
                  label="Unit price:" 
                  id="unitPriceProduct" 
                  type="number" 
                  className="input-field"
                  onChange={(e) => handleInputChange('price', e.target.value)}/>
                  </div>
                </div>
                <SelectComponent
                  className="select-product"
                  label="Category"
                  id="categoryProduct"
                  options={categoryData.message}
                  onChange={(e) => handleInputChange('nameCategory', e.target.value)}
                  keyValue="categories_name"
                />
                <Button 
                id="saveProduct"
                className="insert-data" 
                name="Add Product" 
                onClick={addButtonProduct}/>
            </form>
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
          {productData?.message?.map((row, rowIndex) => {
              return (
                <tr key={`${row.id}: ${row.products_name}`}>
                  <td>{row.products_name}</td>
                  <td>{rowIndex + 1}</td>
                  <td>{parseInt(row.product_amount)}</td>
                  <td>{`$${row.unit_price}`}</td>
                  <td>{row.categories_name}</td>
                  <td>
                    <button onClick={() => handleButtonDeleteProduct(row)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default Product;