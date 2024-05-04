import React, { useState, useEffect, Suspense } from 'react';
import './Home.css';
import {  Link } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import LoadingHome from '../context/loading/HomeLoad/LoadingHome';
import FeaturedAd from './FeaturedAd';
import { Helmet } from 'react-helmet';
import { fetchDataWithCache } from '../context/cache/cacheUtils';

function Home() {
  const [highlightedNews, setHighlightedNews] = useState(null);
  const [highlightedEditors, setHighlightedEditors] = useState(null);
  const [highlightedPlaylists, setHighlightedPlaylists] = useState([]);
  const [newFeaturedAd, setFeaturedAd] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          highlightedNewsDoc,
          highlightedEditorsDoc,
          playlistsSnapshot,
          featuredAdSnapshot,
        ] = await Promise.all([
          fetchDataWithCache('highlightedNewsCache', () => getDoc(doc(database, 'highlighted', 'highlightedNews'))),
          fetchDataWithCache('highlightedEditorsCache', () => getDoc(doc(database, 'highlighted', 'highlightedEditors'))),
          fetchDataWithCache('playlistsCache', () => getDocs(collection(database, 'Playlisthighlights'))),
          fetchDataWithCache('featuredAdCache', () => getDocs(collection(database, 'FeaturedAd'))),
        ]);

        // Fetch and set highlightedNews
        if (highlightedNewsDoc.exists()) {
          const articleRef = doc(database, 'news', highlightedNewsDoc.data().articleId);
          const articleDoc = await getDoc(articleRef);
          if (articleDoc.exists()) {
            setHighlightedNews({ id: articleDoc.id, ...articleDoc.data() });
          }
        }

        // Fetch and set highlightedEditors
        if (highlightedEditorsDoc.exists()) {
          const articleRef = doc(database, 'editors-picks', highlightedEditorsDoc.data().articleId);
          const articleDoc = await getDoc(articleRef);
          if (articleDoc.exists()) {
            setHighlightedEditors({ id: articleDoc.id, ...articleDoc.data() });
            console.log(articleDoc.data);
          }
        }

        // Fetch and set highlightedPlaylists
        const playlists = playlistsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHighlightedPlaylists(playlists);

        // Fetch and set featuredAd
        const featuredAd = featuredAdSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeaturedAd(featuredAd);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const editorsLink = highlightedEditors ? `/article/editors-picks/${highlightedEditors.id}` : '';
  const newsLink = highlightedNews ? `/article/news/${highlightedNews.id}` : '';
 


  return (
    <div className='homepage-components'>
       <Helmet>
        <title>Amplify Ghana | Promoting African Creatives | PR Agency | Music and Entertainment News</title>
        <meta name="description" content= "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered." />
        <meta property="og:image" content='https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png'/>
      </Helmet>
      {loading && <LoadingHome />}
      <div className='homepage-contents'>
        {(highlightedEditors && !loading) && (
          <Suspense fallback={<div>Loading...</div>}>
          <Link to={editorsLink} className='left-homepage' aria-label="link-to-featured-editors-pick" style={{ backgroundImage: `url(${highlightedEditors.image || ''})` }}>
            <div className='editor'>
              <Link to="#/editors-pick" aria-label="link-to-editors-page" className='sticker'>
                <h3>EDITOR'S PICKS</h3>
              </Link>
            </div>
            <div className='editor-text'>
              <h2 className='editor-text-header'>{highlightedEditors.title || 'Loading...'}</h2>
              <p className='editor-text-body'>{highlightedEditors.summary}</p>
            </div>
          </Link>
          </Suspense>
        )}
        <div className='right-homepage'>
          {(highlightedNews && !loading) && (
             <Suspense fallback={<div>Loading...</div>}>
            <Link to={newsLink} className='news-component' aria-label="link-to-featured-news" style={{ backgroundImage: `url(${highlightedNews.image || ''})` }}>
              <div className='editor'>
                <Link to='/news' aria-label="link-to-news-page" className='sticker'>
                  <h3>NEWS</h3>
                </Link>
              </div>
              <div className='news-text'>
                <h2 className='news-text-header'>{highlightedNews.title || 'Loading...'}</h2>
                <p className='news-text-body'>{highlightedNews.summary || ''}</p>
              </div>
            </Link>
            </Suspense>
          )}

          {highlightedPlaylists.map((playlist) => (
            <Suspense key={playlist.id} fallback={<div>Loading...</div>}>
            <div key={playlist.id} className='playlist-component'>
              <a href={playlist.link} target='_blank' rel='noopener noreferrer' aria-label="link-to-featured-playlist">
                <div className='playlist-text'>
                  <Link to='/playlists' className='sticker' aria-label="link-to-playlists-page">
                    <h3>PLAYLISTS</h3>
                  </Link>
                </div>
                <button className='playlist-button' onClick={() => window.open(playlist.link, '_blank')}>
                  Listen
                </button>
                <img src={playlist.imageUrl} alt={playlist.title} className='highlighted-playlist-image' />
              </a>
            </div>
            </Suspense>
          ))}
        </div>
      </div>
      <div className='bottom-homepage'>
      <Suspense fallback={<div>Loading...</div>}>
          {newFeaturedAd.map((ad) => (
            <FeaturedAd key={ad.id} ad={ad} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
