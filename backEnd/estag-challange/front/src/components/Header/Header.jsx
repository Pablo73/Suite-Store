import React from 'react';
import './header.css';

function Header() {

    return (
           <header>
            <h1>Suite Store</h1>
        <nav>
            <ul>
                <li><a href="home.html">Home</a></li>
                <li><a href="products.html">Products</a></li>
                <li><a href="categories.html">Categories</a></li>
                <li><a href="history.html">History</a></li>
            </ul>
        </nav>
    </header>
      );
    }
    export default Header;