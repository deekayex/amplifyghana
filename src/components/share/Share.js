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
  return (
    <div className='share-socials'>
      <div className='share-text'>Share on</div>
      <div className='shareable-socials'> 
           <WhatsappShareButton title={articleTitle} url={`amplifyghana/${articleUrl}.com`}>
      <WhatsappIcon className='share-icon'/>
    </WhatsappShareButton>

    <TwitterShareButton title={articleTitle} url={articleUrl}>
      <TwitterIcon className='share-icon'/>
    </TwitterShareButton>



    <TelegramShareButton title={articleTitle} url={articleUrl}>
      <TelegramIcon className='share-icon'/>
    </TelegramShareButton>

    <FacebookShareButton title={articleTitle} url={articleUrl}>
      <FacebookIcon className='share-icon'/>
    </FacebookShareButton>
    </div>

    </div>
  )
}

export default Share