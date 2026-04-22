import { Link, NavLink } from 'react-router-dom';

import BrandLogo from './BrandLogo';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <Link to="/" className="brand-mark">
          <BrandLogo compact />
        </Link>
        <p className="brand-copy">manage products, prices, and stock.</p>
      </div>
      <nav className="topbar__nav" aria-label="Primary navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          Inventory
        </NavLink>
        <NavLink
          to="/products/new"
          className={({ isActive }) =>
            isActive ? 'nav-link nav-link--active' : 'nav-link'
          }
        >
          Add Product
        </NavLink>
      </nav>
      <div className="topbar__session">
        <span className="session-note">{user?.email ?? 'Signed in'}</span>
        <button type="button" className="button button--ghost" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
