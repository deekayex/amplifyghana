import React from 'react'

const LoadingArticles = () => {
  return (
    <div>
      <div className='flex-contents'></div>
      <div className='page-contents skeleton-cards'>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      <div className='content-card card-skeleton'></div>
      </div>
    </div>
  )
}

export default LoadingArticles