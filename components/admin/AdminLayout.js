"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, getIdTokenResult, getAuth, signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import './Admin.css';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AdminLayout = ({ children }) => {
  const [setIsAdmin] = useState(false);
  // const[showPosts, setShowPosts] = useState(false);

  const router= useRouter();


  const handleSignOut = async () => {
    const isConfirmed = window.confirm('Are you sure you want to sign out?');
    if (isConfirmed) {
      const authInstance = getAuth();
      try {
        await signOut(authInstance);
        router.push('/');
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
            redirect('/');
          }
        });
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <div className='admin-page'>
      <div className='admin-flex'>
        <div className='admin-header'>
          Admin
        </div>
        <button onClick={handleSignOut} className='sign-out'>
          <Image src={'/power.svg'} alt='Sign Out' className='sign-out-icon' width={100} height={100}/>
        </button>
      </div>

      <div className='admin-page-links'>
        <div className='page-managers'>
          <div className='posts-manager'>
            <div className='admin-link'>
              <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/create-posts'>
                Create Posts
              </Link>
            </div>
            <div className='admin-link'>
              <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517'>
                Manage Posts
              </Link>
            </div>
          </div>

          <div className='playlists-manager'>
            <div className='admin-link'>
              <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/update-playlist'>
                Update Playlists
              </Link>
            </div>
            <div className='admin-link'>
              <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/all-playlists'>
                Manage Playlists
              </Link>
            </div>
          </div>

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
          <div className='admin-link'>
            <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/inbox'>
              Messages
            </Link>
          </div>
          <div className='admin-link'>
            <Link href='/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/page-manager'>
              Edit Pages
            </Link>
          </div>
        </div>

        <div className='admin-pages'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
