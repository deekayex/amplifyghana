import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';
import './Admin.css';


const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
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
        <div className='admin-header'>
        Admin
        </div>
          <button onClick={handleSignOut} className='sign-out'>
            <img src={process.env.PUBLIC_URL + '/power.svg'} alt='Sign Out' className='sign-out-icon'/>
          </button>
      </div>

      <div className='admin-page-links'>
       <div className='page-managers'>
        <div className='posts-manager'>         
          <div className='admin-link'>
            <NavLink to= 'create-posts' >
             Create Posts
          </NavLink>
          </div>
           
          <div className='admin-link'><NavLink to = "all-articles">Manage Posts</NavLink></div>
        </div>
          
        <div className='playlists-manager'>
          <div className='admin-link'>
          <NavLink to='update-playlist'>
             Update Playlists
          </NavLink>  
          </div>
          <div className='admin-link'>
          <NavLink to='all-playlists'>
            Manage Playlists
          </NavLink>
          </div>
        </div>

        {/* Special Privileges */}
        <div className='admin-link'>
          <NavLink to='top-picks'>
            Top Picks
          </NavLink>
          </div>

        <div className='admin-link'>
          <NavLink to='featured-ad'>
            Featured Ad
          </NavLink>
          </div>

        <div className='page-manager'>
          Edit Pages
          </div>
      </div>

    <div className='admin-pages'>
    <Outlet/>
   </div>
    </div>
    </div>
  );
};

export default Admin;
