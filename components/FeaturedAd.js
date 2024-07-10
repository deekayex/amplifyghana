// FeaturedAd.js
import React from 'react';

const FeaturedAd = ({ ad }) => (
  <a href={ad.link} className='featured-ad' target="_blank" rel="noopener noreferrer">
    <img src={ad.imageUrl} alt={ad.title} className='ad' />
  </a>
);

export default FeaturedAd;
