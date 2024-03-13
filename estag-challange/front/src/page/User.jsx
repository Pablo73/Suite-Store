import React, { useEffect, useState,useContext } from 'react';
import SuiteStoreContext from '../context/SuiteStoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { putData, fetchData } from '../utils/apiUtils';

function User() {

    const token = sessionStorage.getItem('token'); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const columns = ['Code', 'Data', 'Tax', 'Total']
    const [userIdData, setUserIdData] = useState([]);
    const { setIsLoading } = useContext(SuiteStoreContext);
    
    const { allOrderData } = useContext(SuiteStoreContext) ?? { allOrderData: [] };
    
    const formatData = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    useEffect(() => {
        const getUserId = async () => {
            try {
                const url = 'user/id';
                const headers = { 
                    'Content-Type': 'application/json',
                    'Authorization': token
                };
   
                await fetchData(url, setUserIdData, setIsLoading, headers);

            } catch (error) {
                console.error('Error in API call:', error.message);
            }
        };
      
        getUserId();
      }, []); 

    const [newUser, setNewUser] = useState(false);

    const [newPasswordData, setNewPasswordData] = useState({
        name:'',
        password: '',
        confirmPassword: ''
      });

  const handleInputChange = (name, value) => {
    setNewPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const booleanButton = () => {
    setNewUser(!newUser);
  };

  const changePassword = async () => {
      try {
        setNewUser(false);
        if (newPasswordData.password !== newPasswordData.confirmPassword) {
          alert('Passwords do not match. Please confirm your password.');
          return;
        }
  
        if (!newPasswordData.password || !newPasswordData.confirmPassword) {
          alert('Please enter a value to register.');
          return;
        }
        const { confirmPassword, ...postDataWithoutConfirm } = newPasswordData;
  
        const url = 'user/update';
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': token
           };
  
        await putData(url, postDataWithoutConfirm, headers, handleApiResponse, navigate);
  
      } catch (error) {
        console.error('Error in API call:', error.message);
      }
  };

  const handleApiResponse = (response) => {
    console.log(response)
    if (response.status === 200) {
      alert(`Success register.`);
      navigate('/');
    }
  };


    return(
        <div>
      <Header/>
      <div className="container-all-data">
        <div className="input-data">
        {!newUser && (
            <form>
                <div className="input-home">
                <div>
                    <Input 
                    label="Name user:" 
                    id="UserName" 
                    type="text" 
                    value={userIdData?.message?.name_user || ''}
                    className="input-field"
                    onChange={() => {}}
                    disabled/>
                </div>
                </div>
                <Button 
                id="changeUser" 
                className="insert-data" 
                name="Change password" 
                type="button"
                onClick={() => booleanButton()}/>
            </form>
        )}
            {newUser && (
                <form>
                <div className="input-home">
                <Input 
                    label="User" 
                    id="username" 
                    type="text"
                    name='userName'
                    className="input-field"
                    autoComplete='userAdmin'
                    onChange={(e) => handleInputChange('name', e.target.value)}/>
                </div>
                <div className="input-home">
                  <div>
                  <Input 
                    label="Password:"
                    id="password" 
                    type="password"
                    name='confirmPassword'
                    className="input-field"
                    autoComplete="current-password"
                    onChange={(e) => handleInputChange('password', e.target.value)}/>
                  </div>
                  <div>
                  <Input        
                    label="Confirm Password:"  
                    id="confirm-password" 
                    type="password"
                    name='current-password'
                    className="input-field"
                    autoComplete="current-password"
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}/>
                  </div>
                </div>
                <Button 
                id="changePassword" 
                className="insert-data" 
                name="New password" 
                type="button"
                onClick={changePassword}/>
            </form>
            )}
        </div>
        <hr className="line-between-sectors"></hr>
        <div className="data">
            <table id="tableCategory">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
         {allOrderData?.message?.map((row, rowIndex) => {
            const dataFormat = formatData(row.order_date);
              return (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  <td>{dataFormat}</td>
                  <td>{`$${row.tax_order}`}</td>
                  <td>{`$${row.total_order}`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
    )
}

export default User;