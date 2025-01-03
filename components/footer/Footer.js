import React from "react";
import "./Footer.css";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="footer">
      <div>
        <Link href="/">
          <Image
            src={"/amplifyghlogo.png"}
            alt="Amplify logo"
            className="logo-footer"
            aria-label="link-to-home-page"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '40%', height: 'auto' }}
          />
        </Link>
      </div>
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
        <p className="copyright">© 2024 Amplify Ghana. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
