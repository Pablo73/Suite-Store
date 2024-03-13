import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SuiteStoreContext from '../../context/SuiteStoreContext';
import Loading from '../../components/Loading/Loading';

function Header() {
  const { isLoading } = useContext(SuiteStoreContext);

  const { userRole, setUserRole } = useContext(SuiteStoreContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleLogoff = () => {
    sessionStorage.removeItem('token');
    setUserRole('');
    navigate('/');
  }

  const handleSetting = () => {
    navigate('/user');
  }

  const adminLinks = (
    <>
      <li><NavLink to="/home">Home</NavLink></li>
      <li><NavLink to="/product">Products</NavLink></li>
      <li><NavLink to="/category">Categories</NavLink></li>
      <li><NavLink to="/history">History</NavLink></li>
      <li><NavLink to="/allUser">User</NavLink></li>
    </>
  );

  const userLinks = (
    <>
      <li><NavLink to="/home">Home</NavLink></li>
      <li><NavLink to="/history">History</NavLink></li>
    </>
  );

  const menuLogoff = (
    <div className='menuSetting'>
      <div className='person'>
        <i id='burguer' onClick={handleSetting} className="material-symbols-outlined">person</i>
        <div onClick={handleSetting}>Setting user</div>
      </div>
      <div className='logoff'>
        <i id='burguer' onClick={handleLogoff} className="material-symbols-outlined">logout</i>
        <div onClick={handleLogoff}>Logout</div>  
      </div>
    </div>
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
