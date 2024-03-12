import React, { useContext, useState } from 'react';
import Header from '../components/Header/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import SuiteStoreContext from '../context/SuiteStoreContext';
import { deleteData, postData } from '../utils/apiUtils';


function Category() {
  
  const navigate = useNavigate();
  const location = useLocation();
  const columns = ['Category name', 'Code', 'Tax']
  const { categoryData, setCategoryData } = useContext(SuiteStoreContext) ?? { categoryData: [] };
  const token = sessionStorage.getItem('token');

  const [newCategoryData, setNewCategoryData] = useState({
    name : '',
    tax: '',
  });

  const handleInputChange = (name, value) => {
    setNewCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteButtonCategory = async (rowData) => {
    try {
      const url = 'category/delete';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

       const requestBody = {
        name: rowData.categories_name
    };

      await deleteData(url, requestBody, headers, handleApiResponseDelete, navigate, location);

    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponseDelete = (response) => {
    if (response.status === 200 && response.message && response.message.categories) {
      setCategoryData(response.message.categories);
      window.location.reload();
    } 
  };

  const addButtonCategory = async () => {
    try {

      if (!newCategoryData.name || !newCategoryData.tax) {
        alert('Please enter a value to register.');
        return;
      }

      if (newCategoryData.name.trim() === '') {
        alert('Please enter a value to register.');
        return;
      }
      
      const url = 'category/insert';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

      await postData(url, newCategoryData, headers, handleApiResponseNew, navigate, location);
    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponseNew = (response) => {
    if (response.status === 201 && response.message && response.message.categories) {
      window.location.reload();
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
                    label="Category name:" 
                    id="categoryName" 
                    type="text" 
                    className="input-field"
                    onChange={(e) => handleInputChange('name', e.target.value)}/>
                    
                  </div>
                  <div>
                  <Input label="Tax:" 
                  id="taxCategory" 
                  type="number" 
                  className="input-field"
                  onChange={(e) => handleInputChange('tax', e.target.value)}/>
                  
                  </div>
                </div>
                <Button 
                id="saveCategory" 
                className="insert-data" 
                name="Add Category" 
                type="button"
                onClick={addButtonCategory}/>
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
          {categoryData?.message?.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  <td>{row.categories_name}</td>
                  <td>{rowIndex + 1}</td>
                  <td>{`${row.tax}%`}</td>
                  <td>
                    <button onClick={() => deleteButtonCategory(row)}>Delete</button>
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

export default Category;