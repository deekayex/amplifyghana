import React, { useState, useEffect } from 'react';
import './Home.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import LoadingHome from '../context/loading/HomeLoad/LoadingHome';
import FeaturedAd from './FeaturedAd';

function Home() {
  const [highlightedNews, setHighlightedNews] = useState(null);
  const [highlightedEditors, setHighlightedEditors] = useState(null);
  const [highlightedPlaylists, setHighlightedPlaylists] = useState([]);
  const [newFeaturedAd, setFeaturedAd] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [highlightedNewsDoc, highlightedEditorsDoc, playlistsSnapshot, featuredAdSnapshot] = await Promise.all([
          getDoc(doc(database, 'highlighted', 'highlightedNews')),
          getDoc(doc(database, 'highlighted', 'highlightedEditors')),
          getDocs(collection(database, 'Playlisthighlights')),
          getDocs(collection(database, 'FeaturedAd')),
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
      {loading && <LoadingHome />}
      <div className='homepage-contents'>
        {(highlightedEditors && !loading) && (
          <Link to={editorsLink} className='left-homepage' style={{ backgroundImage: `url(${highlightedEditors.image || ''})` }}>
            <div className='editor'>
              <Link to="#/editors-pick" className='sticker'>
                EDITOR'S PICKS
              </Link>
            </div>
            <div className='editor-text'>
              <p className='editor-text-header'>{highlightedEditors.title || 'Loading...'}</p>
              <p className='editor-text-body'>{highlightedEditors.summary}</p>
            </div>
          </Link>
        )}
        <div className='right-homepage'>
          {(highlightedNews && !loading) && (
            <Link to={newsLink} className='news-component' style={{ backgroundImage: `url(${highlightedNews.image || ''})` }}>
              <div className='editor'>
                <Link to='/news' className='sticker'>
                  NEWS
                </Link>
              </div>
              <div className='news-text'>
                <p className='news-text-header'>{highlightedNews.title || 'Loading...'}</p>
                <p className='news-text-body'>{highlightedNews.summary || ''}</p>
              </div>
            </Link>
          )}

          {highlightedPlaylists.map((playlist) => (
            <div key={playlist.id} className='playlist-component'>
              <a href={playlist.link} target='_blank' rel='noopener noreferrer'>
                <div className='playlist-text'>
                  <Link to='/playlists' className='sticker'>
                    PLAYLISTS
                  </Link>
                </div>
                <button className='playlist-button' onClick={() => window.open(playlist.link, '_blank')}>
                  Listen
                </button>
                <img src={playlist.imageUrl} alt={playlist.title} className='highlighted-playlist-image' />
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className='bottom-homepage'>
        {newFeaturedAd.map((ad) => (
          <FeaturedAd key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}

export default Home;
