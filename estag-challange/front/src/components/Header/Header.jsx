import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SuiteStoreContext from '../../context/SuiteStoreContext';
import Loading from '../../components/Loading/Loading';

function Header({ userRole }) {
  const { isLoading } = useContext(SuiteStoreContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleLogoff = () => {
    sessionStorage.removeItem('token');
    Cookies.remove('userRole');
    navigate('/');
  }

  const adminLinks = (
    <>
      <li><NavLink to="/home">Home</NavLink></li>
      <li><NavLink to="/product">Products</NavLink></li>
      <li><NavLink to="/category">Categories</NavLink></li>
      <li><NavLink to="/history">History</NavLink></li>
      <li><NavLink to="/user">User</NavLink></li>
    </>
  );

  const userLinks = (
    <>
      <li><NavLink to="/home">Home</NavLink></li>
      <li><NavLink to="/history">History</NavLink></li>
    </>
  );

  const menuLogoff = (
    <span onClick={handleLogoff}>Logoff</span>
  );

  return (
    <header>
      <div id='nav'>
        <div>
          <h1>Suite Store</h1>
        </div>
        <div>
          <nav>
            {isLoading ? (
              <Loading/>
            ) : (
              <ul>
                {userRole === 'admin' ? adminLinks : userLinks}
              </ul>
            )}
          </nav>
        </div>
      </div>
      <div className='menuLogoff'>
        <div>
          <i id='burguer' onClick={toggleMenu} className="material-symbols-outlined">menu</i>
        </div>
        <div>
          {isMenuOpen && (<menu>{menuLogoff}</menu>)}
        </div>
      </div>
    </header>
  );
}

export default Header;
