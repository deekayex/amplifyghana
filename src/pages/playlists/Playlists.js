import React, { useState, useEffect } from 'react';
import './Playlists.css';
import { database, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../context/loading/LoadingScreen';

// Constant for the button text
const PLAYLIST_BUTTON_TEXT = 'LISTEN';



const Playlists = () =>{
  const [playlists, setPlaylists] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsCollection = collection(database, 'playlists');
        const playlistsSnapshot = await getDocs(playlistsCollection);
  
        const playlistsData = playlistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchPlaylists(); // Fetch playlists when the component mounts
  }, []);


    
  const handleDeletePlaylist = async (id) => {
    const playlistDoc = doc(database, 'playlists', id);
    await deleteDoc(playlistDoc);

    setPlaylists((prevPlaylists) => prevPlaylists.filter((playlist) => playlist.id !== id));
  };

  const handleListenButtonClick = (link) => {
    // Handle redirection when "LISTEN" button is clicked
    window.open(link, '_blank');
  };


  return (
    <div className='playlist-page'>
      <div className='space' />
      <div className='playlist-header'>Playlists
      </div>

      {isLoading ? (
        <LoadingScreen/>
      ) : (

      <div className='playlist-container'>
        {playlists.map((playlist) => (
           <div className='playlist_component' key={playlist.id}
           onDelete={handleDeletePlaylist}
           {...playlist}>
           <button className='delete-button' onClick={() => handleDeletePlaylist(playlist.id)}>
            Delete
           </button>
         <div className='playlist_image'>
           <img src={playlist.image} alt={playlist.altText} className='picture' />
         </div>
         <div className='playlist_text'>
           {playlist.summary}
           <button className='playlist_button' onClick={() => handleListenButtonClick(playlist.link)}>
             {PLAYLIST_BUTTON_TEXT}
           </button>
         </div>
       </div>         
        
        ))}
      </div>
      )}
    </div>
  );
};


   


export default Playlists;
