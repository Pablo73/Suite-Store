import React from 'react';
import './App.css'
import { Route, Routes } from "react-router-dom";
import ProtectedRoute  from './components/PrivateRoute';
import Home from './page/Home';
import Category from './page/Category';
import History from './page/History';
import Product from './page/Product';
import Login from '../src/page/Login/Login';
import DetailsTable from './page/DetailsTable'
import Register from '../src/page/Register/Register';
import User from './page/User';
import Cookies from 'js-cookie';


function App() {

  const retrievedRole = Cookies.get('userRole');

  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/detailsTable/:id" element={<DetailsTable />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/category"
          element={
            <ProtectedRoute user={retrievedRole}>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute user={retrievedRole}>
              <Product />
            </ProtectedRoute>
          }
       />
       <Route
          path="/user"
          element={
            <ProtectedRoute user={retrievedRole}>
              <User />
            </ProtectedRoute>
          }
       />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default App
