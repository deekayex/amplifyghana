import React, { lazy, Suspense } from 'react';
import './HomePages.css';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Socials from '../../components/socials/Socials';
import Home from '../../components/Home';


const News = lazy(() => import('../news/News'));
const EditorsPicks = lazy(() => import('../editorsPicks/EditorsPicks'));

function HomePages() {
  
  return (
    <div className='container' id='home'>
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

          <Home />

          <Suspense fallback={<div>Loading...</div>}>
            {/* Lazy-loaded News component */}
            <News />
            {/* Lazy-loaded EditorsPicks component */}
            <EditorsPicks />
          </Suspense>

        </div>
      </div>
    </div>
  );
}

export default HomePages;
