import React, { useState } from 'react';
import { postData } from '../../utils/apiUtils';
import { useNavigate   } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Register.css'

function Register() {

  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name : '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (name, value) => {
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterClick = async () => {
    try {
      if (registerData.password !== registerData.confirmPassword) {
        alert('Passwords do not match. Please confirm your password.');
        return;
      }

      if (!registerData.name || !registerData.password || !registerData.confirmPassword) {
        alert('Please enter a value to register.');
        return;
      }
  
      if (registerData.name.trim() === '') {
        alert('Please enter a value to register.');
        return;
      }

      const { confirmPassword, ...postDataWithoutConfirm } = registerData;

      const url = 'user/insert';
      const headers = { 'Content-Type': 'application/json' };

      await postData(url, postDataWithoutConfirm, headers, handleApiResponse, navigate);

    } catch (error) {
      console.error('Error in API call:', error.message);
    }
};

const handleApiResponse = (response) => {
  if (response.status === 201) {
    alert(`Success register.`);
    navigate('/');
  }
};


  return (
    <div className="body">
  <div className="signup-container">
    <h2>Register</h2>
    <form id="registerForm">
      <div className="form-group">
      <Input 
        label="User" 
        id="username" 
        type="text"
        name='userName'
        className="form-group"
        autoComplete='userAdmin'
        onChange={(e) => handleInputChange('name', e.target.value)}
      />
      </div>
      <div className="form-group">
      <Input 
        label="Password"
        id="password" 
        type="password"
        name='confirmPassword'
        className="form-group"
        autoComplete='new-password'
        onChange={(e) => handleInputChange('password', e.target.value)}
      />
      </div>
      <div className="form-group">
       <Input 
        label="Confirm the Password"  
        id="confirm-password" 
        type="password"
        name='current-password'
        className="form-group"
        autoComplete='current-password'
        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
      />
      </div>
      <Button id="button-register" 
        className="signup-btn" 
        name="Register" 
        type="button"
        onClick={handleRegisterClick}
      />
    </form>
  </div>
  </div>
  );
}

export default Register;