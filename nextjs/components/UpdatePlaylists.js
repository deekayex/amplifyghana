import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from '@firebase/firestore';
import { database, storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import NewPlaylistForm from './forms/editor/newPlaylist/NewPlaylist';



const UpdatePlaylists = () => {
  const [playlistData, setPlaylistData] = useState({
    title: '',
    summary: '',
    image: null,
    link: '',
  });

  const handleSaveNewPlaylist = async (newPlaylistData) => {
    try {
      const { title, summary, image, link } = newPlaylistData;

      const storageRef = ref(storage, 'playlist_images/' + image.name);
      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Add the new playlist to the Firestore collection with the image URL
      const newPlaylistRef = await addDoc(collection(database, 'playlists'), {
        title,
        summary,
        link,
        image: downloadURL, // Use the URL obtained from Firebase Storage
        timestamp: serverTimestamp(),
      });

      alert('New playlist created successfully!');
    } catch (error) {
      console.error('Error creating new playlist', error);
    }
  };

  const handleCancel = () => {
    // Reset form state on cancel
    setPlaylistData({
      title: '',
      summary: '',
      image: null,
      link: '',
    });
  };

  return (
    <div>
      <NewPlaylistForm
        onSave={handleSaveNewPlaylist}
        onCancel={handleCancel}
        setPlaylistData={setPlaylistData} // Pass setPlaylistData to handleSaveNewPlaylist
      />
    </div>
  );
};

export default UpdatePlaylists;
