import React from 'react';
import { Link } from 'react-router-dom';


const HighlightedEditors = ({highlightedEditors}) => {
  const editorsLink = highlightedEditors ? `article/editors-picks${highlightedEditors.id}` : '';
  return (

    <Link to={editorsLink}  >
      <div className='editors-highlighted' tyle={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }}>
      <div className='editor'>
        <Link  to="/#editors-pick" className='footer-link'>
          EDITOR'S PICKS
        </Link>
      </div>
      <div className='highlighted-text'>
        <p className='highlighted-header'>{highlightedEditors.title || 'Loading...'}</p>
        <p className='highlighted-text-body'>{highlightedEditors.summary || 'Loading...'}</p>
      </div>
      </div>
    </Link>
  );
}

export default HighlightedEditors