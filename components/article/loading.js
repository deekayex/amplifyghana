import React from 'react';
import '../../context/loading/LoadingScreen.css'

export default function Loading() {
  return (
    <div>
      <div className='flex-contents'></div>
      <div className='page-contents skeleton-cards'>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      </div>
    </div>
  )
}