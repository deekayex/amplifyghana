import React from 'react'
import './HomePages.css'
import Home from '../../components/Home'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import News from '../news/News';
import EditorsPicks from '../editorsPicks/EditorsPicks';
import Socials from '../../components/socials/Socials';



function HomePages() {
  return (
    <div className='container'id='home'>
      <div>
         <div className='home-page'>
          <div className='space'/>
          <div className='home-menu-icons'>
            <div className='home-icon'>
               <HomeOutlinedIcon fontSize='10rem' className='home_icon'/>
               HOME
               </div>
               <div className='home-socials'><Socials/></div>
          </div>
            <Home/>
            <News/>
            <EditorsPicks/>
          </div>
      </div>
    </div>
        
  )
}

export default HomePages