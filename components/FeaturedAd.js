// FeaturedAd.js
import Image from 'next/image';
import React from 'react';

const FeaturedAd = ({ ad }) => (
  <a href={ad.link} className='featured-ad' target="_blank" rel="noopener noreferrer">
    <Image src={ad.imageUrl} alt={ad.title} className='ad' width={100000}
    height={200}/>
  </a>
);

export default FeaturedAd;
