import { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  X,
  LayoutDashboard,
  Home,
  Grid3X3,
  LogOut,
  User,
  ShieldCheck,
  Library,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === "dark";
  const isAdmin = user?.role === "ADMIN";

const navItems = useMemo(() => {
  const items = [
    {
      to: "/",
      label: "Home",
      icon: <Home size={16} />,
    },
    {
      to: "/products",
      label: "Products",
      icon: <Grid3X3 size={16} />,
    },
  ];

  if (user) {
    items.push({
      to: "/my-purchases",
      label: "My Purchases",
      icon: <Library size={16} />,
    });

    items.push({
      to: "/counselling",
      label: "Counselling",
      icon: <GraduationCap size={16} />,
    });
  }

  if (isAdmin) {
    items.push({
      to: "/admin",
      label: "Admin",
      icon: <LayoutDashboard size={16} />,
      admin: true,
    });
  }

  if (!user) {
    items.push({
      to: "/login",
      label: "Login",
      icon: <User size={16} />,
    });
  }

  return items;
}, [user, isAdmin]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive
      ? isDark
        ? "#f5d800"
        : "#5f4600"
      : isDark
      ? "#b6aa61"
      : "#806b24",
    background: isActive
      ? isDark
        ? "rgba(245, 216, 0, 0.12)"
        : "rgba(180, 140, 0, 0.1)"
      : "transparent",
  });

  return (
    <header
      className={`gv-navbar ${scrolled ? "gv-navbar-scrolled" : ""}`}
      data-theme-mode={theme}
    >
      <div className="gv-nav-inner">
        {/* Logo */}
        <Link to="/" className="gv-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="TrackPad" className="logo-image" />
          <span>TrackPad</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="gv-desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={item.admin ? "gv-nav-link gv-admin-link" : "gv-nav-link"}
              style={navLinkStyle}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button className="gv-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          )}

          <Link to="/shop" className="gv-shop-btn">
            <ShoppingBag size={16} />
            Shop
          </Link>

          <button
            className="gv-icon-btn gv-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="gv-mobile-actions">
          <Link to="/shop" className="gv-shop-btn-mobile" onClick={closeMenu}>
            <ShoppingBag size={18} />
          </Link>
          <button
            className="gv-icon-btn gv-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="gv-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="gv-mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={
                item.admin ? "gv-mobile-link gv-admin-link" : "gv-mobile-link"
              }
              style={navLinkStyle}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          {user && (
            <button className="gv-mobile-logout" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          )}

          <Link to="/shop" className="gv-mobile-shop" onClick={closeMenu}>
            <ShoppingBag size={16} />
            Shop Products
          </Link>

          {/* Trust Badge in Mobile Menu */}
          <div className="gv-mobile-trust-badge">
            <ShieldCheck size={14} />
            <span>Secure & Trusted</span>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --gv-nav-bg-light: rgba(255, 253, 240, 0.96);
          --gv-nav-bg-dark: rgba(8, 18, 12, 0.96);
          --gv-border-light: rgba(150, 115, 0, 0.16);
          --gv-border-dark: rgba(245, 216, 0, 0.14);
          --gv-text-soft-light: #806b24;
          --gv-text-soft-dark: #b6aa61;
          --gv-icon-bg-light: rgba(160, 120, 0, 0.06);
          --gv-icon-bg-dark: rgba(245, 216, 0, 0.08);
          --gv-icon-border-light: rgba(160, 120, 0, 0.2);
          --gv-icon-border-dark: rgba(245, 216, 0, 0.22);
          --gv-shadow-light: rgba(87, 69, 0, 0.09);
          --gv-shadow-dark: rgba(0, 0, 0, 0.28);
          --gv-primary: #22c55e;
          --gv-secondary: #f5d800;
        }

        .gv-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: "Inter", "DM Sans", system-ui, sans-serif;
          background: var(--gv-nav-bg);
          border-bottom: 1px solid transparent;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gv-navbar[data-theme-mode="dark"] {
          --gv-nav-bg: var(--gv-nav-bg-dark);
          --gv-border: var(--gv-border-dark);
          --gv-text-soft: var(--gv-text-soft-dark);
          --gv-icon-bg: var(--gv-icon-bg-dark);
          --gv-icon-border: var(--gv-icon-border-dark);
          --gv-shadow: var(--gv-shadow-dark);
        }

        .gv-navbar[data-theme-mode="light"] {
          --gv-nav-bg: var(--gv-nav-bg-light);
          --gv-border: var(--gv-border-light);
          --gv-text-soft: var(--gv-text-soft-light);
          --gv-icon-bg: var(--gv-icon-bg-light);
          --gv-icon-border: var(--gv-icon-border-light);
          --gv-shadow: var(--gv-shadow-light);
        }

        .gv-navbar-scrolled {
          backdrop-filter: blur(20px);
          border-bottom-color: var(--gv-border);
          box-shadow: 0 12px 32px var(--gv-shadow);
        }

        .gv-nav-inner {
          width: min(1380px, 95%);
          height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .gv-nav-link svg,
        .gv-mobile-link svg {
        flex-shrink: 0;
         }

        /* Logo */
        .gv-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(120deg, #f5d800, #22c55e 60%, #e6a800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          white-space: nowrap;
        }

      .gv-logo .logo-image {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
}

        /* Desktop Navigation */
        .gv-desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .gv-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.625rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          color: var(--gv-text-soft);
        }

        .gv-nav-link:hover {
          transform: translateY(-2px);
          background: rgba(34, 197, 94, 0.1) !important;
          color: var(--gv-primary) !important;
        }

        .gv-admin-link {
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* Logout Button */
        .gv-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--gv-icon-border);
          background: transparent;
          color: var(--gv-text-soft);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.625rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .gv-logout-btn:hover {
          background: rgba(245, 216, 0, 0.1);
          color: var(--gv-secondary);
          border-color: var(--gv-primary);
        }

        /* Shop Button */
        .gv-shop-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 700;
          text-decoration: none;
          padding: 0.625rem 1.25rem;
          font-size: 0.9rem;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
          transition: all 0.2s ease;
        }

        .gv-shop-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(34, 197, 94, 0.3);
        }

        /* Theme Toggle & Menu Button */
        .gv-icon-btn,
        .gv-menu-btn {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          border: 1px solid var(--gv-icon-border);
          background: var(--gv-icon-bg);
          color: var(--gv-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .gv-icon-btn:hover,
        .gv-menu-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: var(--gv-primary);
        }

        .gv-theme-toggle {
          margin-left: 0.5rem;
        }

        /* Mobile Actions */
        .gv-mobile-actions {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }

        .gv-shop-btn-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 700;
          text-decoration: none;
          padding: 0.5rem;
          transition: all 0.2s ease;
        }

        .gv-shop-btn-mobile:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
        }

        /* Mobile Menu */
        .gv-mobile-menu {
          width: min(1200px, 92%);
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: var(--gv-nav-bg);
          border-top: 1px solid var(--gv-border);
          box-shadow: 0 10px 20px var(--gv-shadow);
        }

        .gv-mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          color: var(--gv-text-soft);
        }

        .gv-mobile-link:hover {
          background: rgba(34, 197, 94, 0.1);
          color: var(--gv-primary);
        }

        .gv-mobile-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid var(--gv-icon-border);
          background: transparent;
          color: var(--gv-text-soft);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .gv-mobile-logout:hover {
          background: rgba(245, 216, 0, 0.1);
          color: var(--gv-secondary);
          border-color: var(--gv-primary);
        }

        .gv-mobile-shop {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, #f5d800, #22c55e);
          color: #08120c;
          font-weight: 700;
          text-decoration: none;
          padding: 0.75rem 1rem;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
        }

        .gv-mobile-shop:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.2);
        }

        /* Trust Badge in Mobile Menu */
        .gv-mobile-trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: var(--gv-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .gv-desktop-nav {
            display: none;
          }

          .gv-mobile-actions {
            display: flex;
          }

          .gv-logo {
            font-size: 1.35rem;
          }

          .gv-nav-inner {
            padding: 0 0.5rem;
          }
        }

        @media (min-width: 901px) {
          .gv-mobile-menu {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;