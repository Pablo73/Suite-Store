import React, { useContext } from 'react';
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
import AllUser from './page/AllUser';
import User from './page/User';
import SuiteStoreContext from './context/SuiteStoreContext';


function App() {

  const { userRole } = useContext(SuiteStoreContext);

  return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/detailsTable/:id" element={<DetailsTable />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/category"
          element={
            <ProtectedRoute user={userRole}>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product"
          element={
            <ProtectedRoute user={userRole}>
              <Product />
            </ProtectedRoute>
          }
       />
       <Route
          path="/allUser"
          element={
            <ProtectedRoute user={userRole}>
              <AllUser />
            </ProtectedRoute>
          }
       />
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default App
