import React, { useState, useContext } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Link, useNavigate, useLocation   } from 'react-router-dom';
import { postData } from '../../utils/apiUtils';
import Cookies from 'js-cookie';
import './Login.css'

function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  Cookies.remove('userRole');

  const [loginData, setLoginData] = useState({
    name : '',
    password: '',
  });

  const handleInputChange = (name, value) => {
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginClick = async () => {
      try {
        const url = 'user/login';
        const headers = { 'Content-Type': 'application/json' };

        await postData(url, loginData, headers, handleApiResponse, navigate, location);

      } catch (error) {
        console.error('Error in API call:', error.message);
      }
  };

  const handleApiResponse = (response) => {
    if (response.status === 200) {
      const token = response.message.token;
      sessionStorage.setItem('token', token);
      navigate('/home');
    }
  };

  return (
    <div className="body">
    <div className="login-container">
      <h2>Login</h2>
      <form id="loginForm">
        <div className="form-group">
        <Input 
          label="User" 
          id="username" 
          type="text"
          name='userName'
          className="form-group"
          autoComplete="current-username" 
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        </div>
        <div className="form-group">
        <Input 
          label="Password" 
          id="password" 
          type="password"
          name='current-password'
          className="form-group"
          autoComplete='current-password'
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
        </div>
        <Button id="button-login" 
          className="login-btn" 
          name="Entrar" 
          type="button"
          onClick={handleLoginClick}
        />
        <Link to="/register" className="signup-link">
          Not have an account yet? Register here.
        </Link>
      </form>
    </div>
    </div>
  );
}

export default Login;