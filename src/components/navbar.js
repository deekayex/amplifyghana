import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { HashLink as Link } from "react-router-hash-link";
import "./navbar.css";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const section = location.hash.substring(1);
    setActiveSection(section);
  }, [location.hash]);

  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");

  const navToggle = () => {
    setActive(prevActive => (prevActive === "nav__menu" ? "nav__menu nav__active" : "nav__menu"));
    setIcon(prevIcon => (prevIcon === "nav__toggler" ? "nav__toggler toggle" : "nav__toggler"));
  };

  return (
    <nav className="nav">
      <NavLink to="/" spy={true} smooth={true} offset={0} duration={50} initial={0}>
        <img
          src={process.env.PUBLIC_URL + "/amplifyghlogo.png"}
          alt="Amplify logo"
          className="amplify-logo"
        />
      </NavLink>

      <div className="menu-icon" onClick={navToggle}>
        <MenuIcon fontSize="large" />
      </div>

      <ul className={active}>
        <li className="nav__item">
          <Link
            smooth
            to="/#news"
            className={`nav__link ${activeSection === 'news' ? 'nav_active' : ''}`}
          >
            NEWS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/#editors-pick"
            className={`nav__link ${activeSection === 'editors-pick' ? 'nav_active' : ''}`}
          >
            EDITOR'S PICKS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/playlists#playlists"
            className={`nav__link ${activeSection === 'playlists' ? 'nav_active' : ''}`}
          >
            PLAYLISTS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/submissions#submissions"
            className={`nav__link ${activeSection === 'submissions' ? 'nav_active' : ''}`}
          >
            SUBMISSIONS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            smooth
            to="/about#about"
            className={`nav__link ${activeSection === 'about' ? 'nav_active' : ''}`}
          >
            ABOUT US
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
