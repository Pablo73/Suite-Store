import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import SuiteStoreProvider from './context/SuiteStoreProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SuiteStoreProvider>
      <App />
    </SuiteStoreProvider>
</BrowserRouter>,
)
