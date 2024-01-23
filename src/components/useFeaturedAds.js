// useFeaturedAds.js
import { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { database } from '../firebase/firebase';

const useFeaturedAds = () => {
  const [featuredAds, setFeaturedAds] = useState([]);

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, 'FeaturedAd'));
        if (!querySnapshot.empty) {
          const featuredAdData = [];
          querySnapshot.forEach((doc) => {
            featuredAdData.push({ id: doc.id, ...doc.data() });
          });
          setFeaturedAds(featuredAdData);
        } else {
          console.error('No documents found in FeaturedAd collection');
        }
      } catch (error) {
        console.error('Error fetching featured ads', error);
      }
    };

    fetchFeaturedAds();
  }, []);

  return featuredAds;
};

export default useFeaturedAds;
