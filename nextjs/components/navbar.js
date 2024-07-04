"use client";
import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./navbar.css";
import { NavLink, useLocation } from "react-router-dom";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

function Navbar() {
  // const isActive = slug === segment
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const params=useParams();
  // const section = window.location.hash.substring(1);
  // console.log(section);
  // console.log('hello');
  useEffect(() => {
    const section = window.location.hash.substring(1);
    console.log(section);
    setActiveSection(section);
    // console.log(segment);
    // console.log(location);
  }, [params]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && !event.target.closest(".nav")) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <nav className="nav">
      <div className="nav-small-menu">
        <Link href="/" aria-label="link-to-home-page" className="home-link" prefetch>
          <img
            src={"/amplifyghlogo.png"}
            alt="Amplify logo"
            className="amplify-logo"
            onClick={closeMenu}
          />
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <MenuIcon fontSize="large" />
        </div>
      </div>

      <ul className={`nav__menu ${menuOpen ? "nav__active" : ""}`}>
        <li className="nav__item">
          <Link
            href="/#news"
            className={`nav__link ${
              activeSection === "news" ? "nav_active" : ""
            }`}
            aria-label="link-to-news-page"
            onClick={() => {
              closeMenu();
              scrollToTop();
            }}
            prefetch
          >
            NEWS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            href="/#editors-pick"
            className={`nav__link ${
              activeSection === "editors-pick" ? "nav_active" : ""
            }`}
            aria-label="link-to-editors-page"
            onClick={() => {
              closeMenu();
              scrollToTop();
            }}
            prefetch
          >
            EDITOR'S PICKS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            href="/playlists#playlists"
            className={`nav__link ${
              activeSection === "playlists" ? "nav_active" : ""
            }`}
            aria-label="link-to-playlists-page"
            onClick={closeMenu}
            prefetch
          >
            PLAYLISTS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            href="/submissions#submissions"
            className={`nav__link ${
              activeSection === "submissions" ? "nav_active" : ""
            }`}
            aria-label="link-to-submissions-page"
            onClick={closeMenu}
            prefetch
          >
            SUBMISSIONS
          </Link>
        </li>

        <li className="nav__item">
          <Link
            href="/about#about"
            className={`nav__link ${
              activeSection === "about" ? "nav_active" : ""
            }`}
            aria-label="link-to-about-page"
            onClick={closeMenu}
            prefetch
          >
            ABOUT US
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
