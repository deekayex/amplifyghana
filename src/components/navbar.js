import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { HashLink as Link } from "react-router-hash-link";
import "./navbar.css";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const section = location.hash.substring(1);
    setActiveSection(section);
  }, [location.hash]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && !event.target.closest('.nav')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [menuOpen]);

 


  return (
    <nav className="nav">
      <div className="nav-small-menu">
      <NavLink to="/" >
        <img
          src={process.env.PUBLIC_URL + "/amplifyghlogo.png"}
          alt="Amplify logo"
          className="amplify-logo"
          onClick={closeMenu}
        />
      </NavLink>

      <div className="menu-icon" onClick={toggleMenu}>
        <MenuIcon fontSize="large" />
      </div>
      </div>

      <ul className={`nav__menu ${menuOpen ? 'nav__active' : ''}`}>
        <li className="nav__item">
          <Link
            smooth
            to="/#news"
            className={`nav__link ${activeSection === 'news' ? 'nav_active' : ''}`}
            onClick={()=>{closeMenu(); scrollToTop();}}
          >
            NEWS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/#editors-pick"
            className={`nav__link ${activeSection === 'editors-pick' ? 'nav_active' : ''}`}
            onClick={()=>{closeMenu(); scrollToTop();}}
          >
            EDITOR'S PICKS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/playlists#playlists"
            className={`nav__link ${activeSection === 'playlists' ? 'nav_active' : ''}`}
            onClick={closeMenu}
          >
            PLAYLISTS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/submissions#submissions"
            className={`nav__link ${activeSection === 'submissions' ? 'nav_active' : ''}`}
            onClick={closeMenu}
          >
            SUBMISSIONS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/about#about"
            className={`nav__link ${activeSection === 'about' ? 'nav_active' : ''}`}
            onClick={closeMenu}
          >
            ABOUT US
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
