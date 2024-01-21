import React from 'react'
import './Connect.css'

const Connect = () => {
  return (
    <div className='connect-container'>
      <div className='connect-header'>Follow  our Socials</div>

      <div className='connect-socials'>

      <div className='connect-social'>
        
        <a href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1" target="_blank" rel="noreferrer" className='connect-social-image'>
          <img src={process.env.PUBLIC_URL + '/tiktok.png'}
            alt="Follow us on TIktok"                              className="tiktok"
          /></a>
        <a href="https://www.tiktok.com/@amplify.gh?_t=8iv9u4FSAFi&_r=1" target="_blank" rel="noreferrer" className='connect-social-media'>Follow us on Tiktok @amplify.gh</a>
      </div>

      <div className='connect-social'>
        <a href="https://www.instagram.com/_amplifygh?utm_source=qr" target="_blank" rel="noreferrer" className='connect-social-image'>
          <img src={process.env.PUBLIC_URL + '/instagram.png'}
            alt="Follow us on Instagram"                              className="instagram"
          /></a>
        <a href="https://www.instagram.com/_amplifygh?utm_source=qr" target="_blank" rel="noreferrer" className='connect-social-media-insta'>Follow us on Instagram @_amplifygh</a>
      </div>

      <div className='connect-social'>
        <a href="https://x.com/amplifygh?s=21" target="_blank" rel="noreferrer" className='connect-social-image'>
          <img src={process.env.PUBLIC_URL + '/twitter.png'}
            alt="Follow us on Twitter"                              className="twitter"
          /></a>
        <a href="https://x.com/amplifygh?s=21" target="_blank" rel="noreferrer" className='connect-social-x'>Follow us on X @Amplifygh</a>
      </div>

      <div className='connect-social'>
        <a  href="mailto:amplifygh@gmail.com?" target="_blank" rel="noreferrer" className='connect-social-image'>
          <img src={process.env.PUBLIC_URL + '/gmail.png'}
            alt="Send us a mail"                              className="email"
          /></a>
        <a  href="mailto:amplifygh@gmail.com?" target="_blank" rel="noreferrer" className='connect-social-mail'>Send us an Email on Amplifygh@gmail.com</a>
      </div>
      </div>
      </div>
  )
}

export default Connect