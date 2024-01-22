import React from 'react'
import '../LoadingScreen.css'

const LoadingHome = () => {
  return (
    <div className='homepage-components skeleton-container'>
    <div className='homepage-contents'>
    <div className='left-homepage skeleton'>
    <div className='editor-text editor-skeleton-text' >
    <p className='editor-text-header editor-skeleton-text-header '></p>
    <p className='editor-text-body editor-skeleton-text-body'></p>
    <p className='editor-text-body editor-skeleton-text-body2'></p>
    <p className='editor-text-body editor-skeleton-text-body3'></p>
    </div>

    </div>
    <div className='right-homepage news_playlist_container'>
    <div className='news-component skeleton-news'>
      
    </div>
    <div className='playlist-component skeleton-playlist'></div>
    </div>
    </div>
    </div>
  )
}

export default LoadingHome