import React from 'react';
import './Socials.css';
import { Link } from 'react-router-dom';

const Socials = () => {
  return (
    <div className='socials'>
      <div className='insta-social-icon'>
        <a href="https://www.instagram.com/_amplifygh?utm_source=qr" target="_blank" rel="noreferrer">
          
          <img
            src={process.env.PUBLIC_URL + '/instagram_logo.png'}
            alt="Instagram logo"
            className="instagram-logo"
          />
          <img
            src={process.env.PUBLIC_URL + '/alt_instagram_logo.png'}
            alt="Instagram logo"
            className="instagram-logo-active"
          />
        </a>
      </div>
      <div className='social-icon'>
        <a href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1" target="_blank" rel="noreferrer">
          <img src={process.env.PUBLIC_URL + '/tiktok_logo.png'} alt="Tiktok logo" className="tiktok-logo" />
        </a>
      </div>
      <div className='social-icon'>
        <a href="https://x.com/amplifygh?s=21" target="_blank" rel="noreferrer">
          <img src={process.env.PUBLIC_URL + '/x_logo.png'} alt="X logo" className="x-logo" />
        </a>
      </div>
      <div className='social-icon'>
        <a href="mailto:amplifygh@gmail.com?" target="_blank" rel="noreferrer">
          <img src={process.env.PUBLIC_URL + '/email_icon.png'} alt="Email icon" className="email-icon" />
        </a>
      </div>
    </div>
  );
}

export default Socials;
