import React from 'react'
import { Link } from 'react-router-dom';

const HighlightedNews = ({highlightedNews}) => {
  const newsLink = highlightedNews ? `/article/news/${highlightedNews.id}` : '';

  return(
  <div className='right-highlighted'>
  {highlightedNews && (
    <Link to={newsLink} >
      <div className='editor-highlighted' style={{ backgroundImage: `url(${highlightedNews ? highlightedNews.image : ''})` }}>
        <Link to='/news'>NEWS</Link>
      </div>
      <div className='editor'>
      <div className='highlighted-text'>
        <p className='highlighted-header'>{highlightedNews ? highlightedNews.title || 'Loading...' : ''}</p>
        <p className='highlighted-text-body'>{highlightedNews ? highlightedNews.summary : ''}</p>
      </div>
      </div>
    </Link>
  )}
</div>
);
  };

export default HighlightedNews