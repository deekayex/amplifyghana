import React from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
 

const Share = ({articleTitle, articleUrl}) => {
  // Get the current domain
  const currentDomain = window.location.origin;

  // Concatenate the domain with the articleUrl
  const fullUrl = `${currentDomain}${articleUrl}`;


  return (
    <div className='share-socials'>
      <div className='share-text'>Share on</div>
      <div className='shareable-socials'> 
           <WhatsappShareButton title={articleTitle} url={fullUrl}>
      <WhatsappIcon className='share-icon'/>
    </WhatsappShareButton>

    <TwitterShareButton title={articleTitle} url={fullUrl}>
      <TwitterIcon className='share-icon'/>
    </TwitterShareButton>



    <TelegramShareButton title={articleTitle} url={fullUrl}>
      <TelegramIcon className='share-icon'/>
    </TelegramShareButton>

    <FacebookShareButton title={articleTitle} url={fullUrl}>
      <FacebookIcon className='share-icon'/>
    </FacebookShareButton>
    </div>

    </div>
  )
}

export default Share