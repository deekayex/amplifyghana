import React from 'react'
import {
  EmailIcon,
  EmailShareButton,
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
    <WhatsappShareButton title={articleTitle} url={articleUrl}>
      <WhatsappIcon className='social-icon'/>
    </WhatsappShareButton>

    <TwitterShareButton title={articleTitle} url={articleUrl}>
      <TwitterIcon className='social-icon'/>
    </TwitterShareButton>

    <EmailShareButton title={articleTitle} url={articleUrl}>
      <EmailIcon className='social-icon'/>
    </EmailShareButton>

    <TelegramShareButton title={articleTitle} url={articleUrl}>
      <TelegramIcon className='social-icon'/>
    </TelegramShareButton>

    <FacebookShareButton title={articleTitle} url={articleUrl}>
      <FacebookIcon className='social-icon'/>
    </FacebookShareButton>

    </div>
  )
}

export default Share