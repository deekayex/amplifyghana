"use client";
import { addDoc, collection, getDocs, setDoc } from '@firebase/firestore';
import React, { useState } from 'react'
import { database, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const FeatureAd = (onSave, onCancel) => {
  const initialFeature ={
    title: '',
    image: null,
    link: '',
  };

  const[featuredAd, setFeaturedAd] = useState({ ...initialFeature});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeaturedAd({
      ...featuredAd,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setFeaturedAd({
      ...featuredAd,
      image,
    });
  };


  const handleSave = async () => {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, 'highlight/' + featuredAd.image.name);
      await uploadBytes(storageRef, featuredAd.image);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Check if a document already exists in the collection
      const highlightsCollectionRef = collection(database, 'FeaturedAd');
      const querySnapshot = await getDocs(highlightsCollectionRef);
  
      if (querySnapshot.empty) {
        // If no document exists, create a new one
        const newHighlightRef = await addDoc(highlightsCollectionRef, {
          title: featuredAd.title,
          link: featuredAd.link,
          imageUrl: downloadURL,
        });
        alert('Document written with ID: ', newHighlightRef.id);
      } else {
        // If a document exists, update its fields
        const existingDoc = querySnapshot.docs[0];
        await setDoc(existingDoc.ref, {
          title: featuredAd.title,
          link: featuredAd.link,
          imageUrl: downloadURL,
        });
        alert('Document updated with ID: ', existingDoc.id);
      }
  
      // Reset form state on successful save
      setFeaturedAd({ ...initialFeature });
    } catch (error) {
      alert('Error saving featured ad:', error);
    }
  };
  
  
  
  const handleCancel = () => {
    // Reset form state on cancel
    setFeaturedAd({ ...initialFeature });
    onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };


  return (
    <div className='featured-ad'>
      <form onSubmit={handleSubmit} className='playlist-form'>
      <h className>Feature Ad</h>
      <div className='new-playlist-container'>
        <div className='featured-ad-container'style={{
            backgroundImage: featuredAd.image ? `url(${URL.createObjectURL(featuredAd.image)})` : 'none',
          }}>
          
        </div>

      </div>

      
      <input type='file' name='image' accept='image/*' onChange={handleImageChange} required />
      
      <input type='text' name='title' value={featuredAd.title} onChange={handleInputChange} required placeholder='Type the Playlist title' className='playlist-title'/>

      <label>Link:</label>
      <input type='text' name='link' value={featuredAd.link} onChange={handleInputChange} className='playlist-link'/>

      <div className='form-buttons'>
      <div className='playlist-buttons-flex'>
      <button type='button' onClick={handleCancel} className='btn'>
          Cancel
        </button>
        
        <button type='submit' className='btn'>
          Create 
        </button>

      </div>

    </div>
    </form>
    </div>
  )
}

export default FeatureAd