import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './Playlists.css';
import { database } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from '@firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../context/loading/LoadingScreen';
import LoadingPlaylists from '../../context/loading/PlayListLoad/LoadingPlaylists';
import ScrollToTopOnMount from '../../components/ScrollToTop';

// Constant for the button text
const PLAYLIST_BUTTON_TEXT = 'LISTEN';

const Playlists = ({ isPlayListManager }) => {
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsCollection = collection(database, 'playlists');
        const playlistsQuery = query(playlistsCollection, orderBy('timestamp', 'desc'));
        const playlistsSnapshot = await getDocs(playlistsQuery);

        const playlistsData = playlistsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
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
      <ScrollToTopOnMount/>
      <div className='space' />
      <div className='playlist-header'>Playlists</div>
      <div className='playlist-flex'>
        {isLoading ? (
          <LoadingPlaylists />
        ) : (
          <div className='playlist-container'>
            {playlists.map((playlist) => (
              <div className='playlist_component' key={playlist.id}>
                {isPlayListManager && user && (
                  <button className='delete-button' onClick={() => handleDeletePlaylist(playlist.id)}>
                    Delete
                  </button>
                )}
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
    </div>
  );
};

export default Playlists;
