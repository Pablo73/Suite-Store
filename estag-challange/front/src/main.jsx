import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import SuiteStoreProvider from './context/SuiteStoreProvider';

const root = createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
      <SuiteStoreProvider>
        <App/>
      </SuiteStoreProvider>
    </BrowserRouter>
);
