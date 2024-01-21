import React from 'react'
import '../LoadingScreen.css'

const LoadingHome = () => {
  return (
    <div className='homepage-components skeleton-container'>
    <div className='homepage-contents'>
    <div className='left-homepage skeleton'></div>
    <div className='right-homepage news_playlist_container'>
    <div className='news-component skeleton-news'></div>
    <div className='playlist-component skeleton-playlist'></div>
    </div>
    </div>
    </div>
  )
}

export default LoadingHome