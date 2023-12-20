import React from 'react'
import './Socials.css'

const Socials = () => {
  return (
         <div className='socials'>
              
              <img src={process.env.PUBLIC_URL + '/instagram_logo.png'} 
              alt="Instagram logo" className="instagram-logo" />

        
            <img src={process.env.PUBLIC_URL + '/tiktok_logo.png'} 
            alt="Tiktok logo" className="tiktok-logo"/>
          
            <img src={process.env.PUBLIC_URL + '/x_logo.png'} 
            alt="X logo" className="x-logo"/>
        
    
            <img src={process.env.PUBLIC_URL + '/email_icon.png'}
             alt="Email icon" className="email-icon"/>
    
            </div>

  )
}

export default Socials