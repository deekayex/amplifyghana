import React from 'react'
import './Home.css'
import {
  BrowserRouter as Router,
  Route,Routes,
  Link
} from 'react-router-dom';

function Home() {
  return (
    <div className='homepage-components'>
      <div className='homepage-contents'>
        <div className='left-homepage'>
          <Link >

            <div className='editor'>
              EDITOR'S PICK
            </div>

            <div className='editor-text'>
              <p className='editor-text-header'>MUSIC COLLECTIVES IN GHANA, THE CREATIVES</p>
              <p className='editor-text-body'>THERE ARE A LOT OF MUSICAL COLLECTIVES IN GHANA, THE CLAN, SUPER JAZZCLUB, 99 PHACES, RAGE BRUDDAS. ALL OF THE SE GUYS ARE JUST TRYING TO PUSH GHANA MUSIC TO THE WORLD AND STUFF LIKE THAT YOU BARB, EHEHEHEHEHEHEHEHE</p>
            </div>
          </Link>
        </div>
        <div className='right-homepage'>
          <div className='news-component'>
            <Link to="/news">
            <div className='editor'>
              NEWS
            </div>
              <div className='editor-text'>
              <p className='news-text-header'>DC TRUTH RELEASES NEW SINGLE TITLED “ADE AKYE”</p>
              <p className='editor-text-body'>KUMASI RAPPER DC TRUTH THRILLS FANS WITH NEW RELEASE AFTER THE RELEASE OF HIS “FROM THE TRENCHES” EP. TRUTH WAKES UP IN THE MORNING AND DECIDES TO TELL US</p>
            </div> 
            </Link>
         </div>
          <div className='playlist-component'>
            
          <Link to="/playlists">
          <div className='playlist-text'>
             PLAYLISTS
          </div>
          </Link>
         </div>
       </div>
      </div>
      <div className='bottom-homepage'>
        <Link>
        <p className='ad-section'>  PLACE AN AD</p>
        <p className='rent-space'>
        SEND AN EMAIL TO AMPLIFYGH@GMAIL.COM IF YOU WANT THIS SPACE
        </p>
        </Link>
      </div>
  </div>
  )
}

export default Home