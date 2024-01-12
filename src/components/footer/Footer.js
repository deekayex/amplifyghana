import React from 'react'
import "./Footer.css"
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Socials from '../socials/Socials'

const Footer = () => {
  return (
    <div className='footer'>
      <div>
      <NavLink to="/" >
        <img
          src={process.env.PUBLIC_URL + "/amplifyghlogo.png"}
          alt="Amplify logo"
          className="logo-footer"
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
                smooth
                to="/#news" className='footer-link'>
                NEWS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                smooth
                to="/#editors-pick" className='footer-link'>
                EDITOR'S PICKS
              </Link>
            </li>

            <li className="footer-nav__item" >
              <Link
                smooth
                to="/playlists#playlists" className='footer-link'>
                PLAYLISTS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                smooth
                to="/submissions#submissions" className='footer-link'>
                SUBMISSIONS
              </Link>
            </li>

            <li className="footer-nav__item">
              <Link
                smooth
                to="/about#about" className='footer-link'>
                ABOUT US
              </Link>
            </li>
        </div>
        <div className='copyright'>© 2024 Amplify Ghana</div>
      </div>
    </div>
  )
}

export default Footer