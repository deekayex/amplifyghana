"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
// import { Link, useNavigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { getAuth, signOut } from 'firebase/auth';
import './Admin.css';
import { redirect } from 'next/navigation';


const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const[showPosts, setShowPosts] = useState(false);
  

  // const navigate = useNavigate();

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
            // navigate('/');
            redirect('/');
          }
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);


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
            <img src={'/power.svg'} alt='Sign Out' className='sign-out-icon'/>
          </button>
      </div>

      <div className='admin-page-links'>
       <div className='page-managers'>
        <div className='posts-manager'>         
          <div className='admin-link'>
            <Link href= 'cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/create-posts' >
             Create Posts
          </Link>
          </div>
           
          <div className='admin-link'><Link href= "cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/all-articles">Manage Posts</Link></div>
        </div>
          
        <div className='playlists-manager'>
          <div className='admin-link'>
          <Link href='cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/update-playlist'>
             Update Playlists
          </Link>  
          </div>
          <div className='admin-link'>
          <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/all-playlists'>
            Manage Playlists
          </Link>
          </div>
        </div>

        {/* Special Privileges */}
        <div className='admin-link'>
          <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/top-picks'>
            Top Picks
          </Link>
          </div>

        <div className='admin-link'>
          <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/featured-ad'>
            Featured Ad
          </Link>
          </div>

        <div className='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/page-manager'>
          Edit Pages
          </div>
      </div>

    <div className='admin-pages'>
    {/* <Outlet/> */}
   </div>
    </div>
    </div>
  );
};

export default Admin;
