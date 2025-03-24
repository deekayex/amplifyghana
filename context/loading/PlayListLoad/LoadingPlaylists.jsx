import React from 'react'

const LoadingPlaylists = () => {
  return (
    <div className='playlist-flex'>
    <div className='playlist-container'>
      <div className='playlist_component'>
      <div className='playlist_image playlist-image-skeleton'></div>
      <div className=' playlsit-text-skeleton'></div>
      </div>
      <div className='playlist_component'>
      <div className='playlist_image playlist-image-skeleton'></div>
      <div className=' playlsit-text-skeleton'></div>
      </div>
      <div className='playlist_component'>
      <div className='playlist_image playlist-image-skeleton'></div>
      <div className=' playlsit-text-skeleton'></div>
      </div>
    </div>
    </div>
  )
}

export default LoadingPlaylists