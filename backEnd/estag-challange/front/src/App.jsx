import React from 'react';
import './App.css'
import { Route, Switch } from 'react-router-dom';
import Home from './page/Home';
import Category from './page/Category';
import History from './page/History';
import Product from './page/Product';


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/home" component={ Home } />
        <Route path="/category" component={ Category } />
        <Route path="/history" component={ History } />
        <Route path="/product" component={ Product } />
      </Switch>
    </div>
  );
}

export default App
