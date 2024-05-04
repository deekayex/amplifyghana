import React from 'react'
import "./Footer.css"
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <div className='footer'>
      <div>
      <NavLink to="/" >
        <img
          src={process.env.PUBLIC_URL + "/amplifyghlogo.png"}
          alt="Amplify logo"
          className="logo-footer" aria-label="link-to-home-page"
        />
      </NavLink>
      </div>
      {/* <div className='amplify-info'>
        AMPLIFY GHANA IS AN ONLINE CREATIVE’S 
        PROMOTION AND PUBLIC RELATIONS AGENCY FOUNDED IN 2020
      </div> */}
      <div>
        <div className='footer-links'>
            <li className="footer-nav__item">
              <Link
                to="/#news" className='footer-link' aria-label="link-to-news-page">
                NEWS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                to="/#editors-pick" className='footer-link' aria-label="link-to-editors-page">
                EDITOR'S PICKS
              </Link>
            </li>

            <li className="footer-nav__item" >
              <Link
                to="/playlists#playlists" className='footer-link' aria-label="link-to-playlists-page">
                PLAYLISTS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                to="/submissions#submissions" className='footer-link' aria-label="link-to-submissions-page">
                SUBMISSIONS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                to="/about#about" className='footer-link' aria-label="link-to-about-page">
                ABOUT US
              </Link>
            </li>
        </div>
        {/* <div><p>Social logos are obtained from freepiks</p></div> */}
        <div className='copyright'>© 2024 Amplify Ghana</div>
      </div>
    </div>
  )
}

export default Footer