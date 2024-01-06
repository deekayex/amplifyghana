import React, { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from '@firebase/firestore';
import './Admin.css';
import CreateArticleForm from '../../components/forms/editor/CreateArticleForm';
import NewPlaylistForm from '../../components/forms/editor/NewPlaylist';
import Messages from '../../components/messages/Messages';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isArticleFormVisible, setArticleFormVisible] = useState(false);
  const [isPlaylistFormVisible, setPlaylistFormVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const[showPosts, setShowPosts] = useState(false);
  

  const navigate = useNavigate();

  const handleSignOut = async () => {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to sign out?');
  
    if (isConfirmed) {
      const authInstance = getAuth();
      try {
        await signOut(authInstance);
      } catch (error) {
        console.error('Error signing out', error);
      }
    }
  };
  

  const handleCreateFormCancel = () => {
    // Handle cancel button click for the Create Article Form
    setArticleFormVisible(false);
  };

  const handleSaveNewArticle = async (newArticleData) => {
    try {
      const { title, summary, content, image, selectedSection } = newArticleData;

      const storageRef = ref(storage, 'article_images/' + image.name);

      let collectionName;

          if (selectedSection === 'news') {
            collectionName = 'news';
          } else if (selectedSection === 'editors-picks') {
            collectionName = 'editors-picks';
          } else {
            alert('Invalid section selected!');
          }


      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Add the new article to the Firestore collection with the image URL
      const newArticleRef = await addDoc(collection(database, collectionName), {
        title,
        summary,
        content,
        image: downloadURL, // Use the URL obtained from Firebase Storage
      });

      alert('New article created successfully!');
      setArticleFormVisible(false);
    } catch (error) {
      console.error('Error creating new article', error);
    }
  };

  const handleCreatePlaylistFormToggle = () => {
    setPlaylistFormVisible(!isPlaylistFormVisible);
    // Ensure article form is hidden when showing playlist form
    setArticleFormVisible(false);
  };

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
      });

      alert('New playlist created successfully!');
      setArticleFormVisible(false);
    } catch (error) {
      console.error('Error creating new playlist', error);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const idTokenResult = await getIdTokenResult(user);
            setIsAdmin(idTokenResult.claims.admin || false);
          } else {
            // Redirect to login if the user is not signed in
            navigate('/');
          }
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [auth, navigate]);


  // if (isAdmin) {
  //   return (
  //     <div className='admin-page'>
  //       Admin
  //       <div>
  //         <h1>Welcome to the Admin Page!</h1>
  //       </div>
  //     </div>
  //   );
  // } else {

     return (
    <div className='admin-page'>
      {/* Display user */}
      <div className='admin-flex'>
        <div>
        User
        </div>
        <div>
          <button onClick={handleSignOut} className='sign-out'>
            Sign Out
          </button>
          </div>
      </div>

      <div className='admin-page-links'>
       <div className='page-managers'>
        <div className='posts-manager'onMouseEnter={() => setShowPosts(true)} onMouseLeave={()=> setShowPosts(false)}>

          <div>Posts</div>
          {showPosts && (
          <div>
            <NavLink to= 'create-posts' >
          Create Posts
          </NavLink>
          </div>
          )}
          {showPosts &&  <div>Manage Posts</div>}
        </div>
        
        
          
        <div className='playlists-manager'>
          Update Playlists
          <button onClick={handleCreatePlaylistFormToggle}>
            New Playlist
          </button>
          {isPlaylistFormVisible && (
            <div className='form-container'>
              <NewPlaylistForm onSave={handleSaveNewPlaylist} onCancel={handleCreateFormCancel} />
            </div>
          )}
        </div>

        <div><NavLink to= "messages">Submissions Received</NavLink> 
    
        </div>

        {/* Special Privileges */}
        <div>Top Picks</div>
        <div>Featured Ad</div>
        <div className='page-manager'>Edit Pages</div>
    </div>

    <div className='admin-pages'>Pages
    <Outlet/>
   </div>
    </div>
    </div>
  );
};

export default Admin;
