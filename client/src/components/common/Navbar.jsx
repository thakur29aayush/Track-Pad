import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          GreenVault
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>

          {user && <NavLink to="/my-purchases">My Purchases</NavLink>}
          {user && <NavLink to="/counselling">Counselling</NavLink>}

          {user?.role === "ADMIN" && <NavLink to="/admin">Admin</NavLink>}

          {!user ? (
            <NavLink to="/login">Login</NavLink>
          ) : (
            <button onClick={logout}>Logout</button>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;