import React from "react";
import "./Footer.css";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer">
      <div>
        <Link href="/">
          <img
            src={"/amplifyghlogo.png"}
            alt="Amplify logo"
            className="logo-footer"
            aria-label="link-to-home-page"
          />
        </Link>
      </div>
      {/* <div className='amplify-info'>
        AMPLIFY GHANA IS AN ONLINE CREATIVE’S 
        PROMOTION AND PUBLIC RELATIONS AGENCY FOUNDED IN 2020
      </div> */}
      <div>
        <div className="footer-links">
          <li className="footer-nav__item">
            <Link
              href="/#news"
              className="footer-link"
              aria-label="link-to-news-page"
            >
              NEWS
            </Link>
          </li>

          <li className="footer-nav__item">
            <Link
              href="/#editors-pick"
              className="footer-link"
              aria-label="link-to-editors-page"
            >
              EDITOR'S PICKS
            </Link>
          </li>

          <li className="footer-nav__item">
            <Link
              href="/playlists#playlists"
              className="footer-link"
              aria-label="link-to-playlists-page"
            >
              PLAYLISTS
            </Link>
          </li>

          <li className="footer-nav__item">
            <Link
              href="/submissions#submissions"
              className="footer-link"
              aria-label="link-to-submissions-page"
            >
              SUBMISSIONS
            </Link>
          </li>

          <li className="footer-nav__item">
            <Link
              href="/about#about"
              className="footer-link"
              aria-label="link-to-about-page"
            >
              ABOUT US
            </Link>
          </li>
        </div>
        {/* <div><p>Social logos are obtained from freepiks</p></div> */}
        <div className="copyright">© 2024 Amplify Ghana</div>
      </div>
    </div>
  );
};

export default Footer;
