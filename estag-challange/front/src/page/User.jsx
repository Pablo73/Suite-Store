import React, { useContext, useState  } from 'react';
import SuiteStoreContext from '../context/SuiteStoreContext';
import Header from '../components/Header/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Input from '../components/Input';
import Button from '../components/Button';
import { deleteData, postData } from '../utils/apiUtils';

function User() {

  const retrievedRole = Cookies.get('userRole');
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const columns = ['Name User', 'Role']
  const { userData } = useContext(SuiteStoreContext) ?? { userData: [] };

  const [newUserData, setNewUSerData] = useState({
    name : '',
    password: '',
  });

  const handleInputChange = (name, value) => {
    setNewUSerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const deleteButtonCategory = async (user) => {
    try {
      const url = 'user/delete';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

       const requestBody = {
        userName: user
    };

      await deleteData(url, requestBody, headers, handleApiResponseDelete, navigate, location);

    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponseDelete = (response) => {
    if (response.status === 200 && response.message) {
      window.location.reload();
    } 
  };

  const addButtonUserAdmin = async () => {
    try {

      if (!newUserData.name 
        || !newUserData.password) {
        alert('Please enter a value to register.');
        return;
      }
      const url = 'user/insert';
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': token
       };

      const test = await postData(url, newUserData, headers, handleApiResponse, navigate, location);
    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  const handleApiResponse = (response) => {
    if (response.status === 201 && response.message) {
      window.location.reload();
    }  
  }

  return (
    <div>
      <Header userRole={retrievedRole} />
      <div className="container-all-data">
        <div className="input-data">
            <form>
                <div className="input-home">
                  <div>
                    <Input 
                    label="New user admin:" 
                    id="userAdmin" 
                    type="text" 
                    className="input-field"
                    autoComplete="current-username" 
                    onChange={(e) => handleInputChange('name', e.target.value)}/>
                    
                  </div>
                  <div>
                  <Input label="Password:" 
                  id="userPassword" 
                  type="password" 
                  className="input-field"
                  autoComplete="current-password"
                  onChange={(e) => handleInputChange('password', e.target.value)}/>
                  
                  </div>
                </div>
                <Button 
                id="saveUser" 
                className="insert-data" 
                name="Add User Admin" 
                type="button"
                onClick={addButtonUserAdmin}/>
            </form>
        </div>
        <hr className="line-between-sectors"></hr>
        <div className="data">
            <table id="tableUser">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {userData?.message?.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  <td>{row.name_user}</td>
                  <td>{row.role_user}</td>
                  <td>
                    <button onClick={() => deleteButtonCategory(row.name_user)}>Delete</button>
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

export default User;