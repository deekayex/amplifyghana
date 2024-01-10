import React from 'react'
import './Socials.css'
import { Link } from 'react-router-dom'

const Socials = () => {
  return (
         <div className='socials'>
           <a href="https://www.instagram.com/_amplifygh?utm_source=qr" target="_blank">
              <img src={process.env.PUBLIC_URL + '/instagram_logo.png'} 
                alt="Instagram logo" className="instagram-logo" />
            </a>

            <a href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1" target="_blank">       
              <img src={process.env.PUBLIC_URL + '/tiktok_logo.png'} 
               alt="Tiktok logo" className="tiktok-logo"/>
            </a>

            <a href="https://x.com/amplifygh?s=21" target="_blank">
              <img src={process.env.PUBLIC_URL + '/x_logo.png'} 
                alt="X logo" className="x-logo"/>
            </a>
            
            <a href="mailto:max.mustermann@example.com?" target="_blank">
              <img src={process.env.PUBLIC_URL + '/email_icon.png'}
                 alt="Email icon" className="email-icon"/>
            </a>
          </div>

  )
}

export default Socials