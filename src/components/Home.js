import React, { useState, useEffect } from 'react';
import './Home.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import LoadingHome from '../context/loading/HomeLoad/LoadingHome';

function Home() {
  const [highlightedNews, setHighlightedNews] = useState(null); // State to track the highlighted news
  const [highlightedEditors, setHighlightedEditors] = useState(null); // State to track the highlighted editors

  const [highlightedPlaylists, setHighlightedPlaylists] = useState([]);

  const [newFeaturedAd, setfeaturedAd] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your data here...
        const fetchHighlightedNews = getDoc(doc(database, 'highlighted', 'highlightedNews')).then((highlightedNewsDoc) => {
          const highlightedNewsData = highlightedNewsDoc.data();
          if (highlightedNewsData) {
            const articleRef = doc(database, 'news', highlightedNewsData.articleId);
            return getDoc(articleRef).then((articleDoc) => {
              if (articleDoc.exists()) {
                setHighlightedNews({ id: articleDoc.id, ...articleDoc.data() });
              }
            });
          }
        });

        const fetchEditorsHighlight = getDoc(doc(database, 'highlighted', 'highlightedEditors')).then((highlightedEditorsDoc) => {
          const highlightedEditorsData = highlightedEditorsDoc.data();
          if (highlightedEditorsData) {
            const articleRef = doc(database, 'editors-picks', highlightedEditorsData.articleId);
            return getDoc(articleRef).then((articleDoc) => {
              if (articleDoc.exists()) {
                setHighlightedEditors({ id: articleDoc.id, ...articleDoc.data() });
              }
            });
          }
        });

        const fetchHighlightedPlaylists = getDocs(collection(database, 'Playlisthighlights')).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const playlists = [];
            querySnapshot.forEach((doc) => {
              playlists.push({ id: doc.id, ...doc.data() });
            });
            setHighlightedPlaylists(playlists);
          } else {
            console.error('No documents found in Playlisthighlights collection');
          }
        });

        const fetchFeaturedAd = getDocs(collection(database, 'FeaturedAd')).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const featuredAd = [];
            querySnapshot.forEach((doc) => {
              featuredAd.push({ id: doc.id, ...doc.data() });
            });
            setfeaturedAd(featuredAd);
          } else {
            console.error('No documents found in FeaturedAd collection');
          }
        });

        // Wait for all asynchronous operations to complete before setting loading to false
        await Promise.all([fetchHighlightedNews, fetchEditorsHighlight, fetchHighlightedPlaylists, fetchFeaturedAd]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  // Add a check for highlightedEditors before accessing its properties
  const editorsLink = highlightedEditors ? `/article/editors-picks/${highlightedEditors.id}` : '';
  const newsLink = highlightedNews ? `/article/news/${highlightedNews.id}` : '';

  if (loading) {
    return <LoadingHome />;
  }

  return (
    <div className='homepage-components'>
      <div className='homepage-contents'>
        {highlightedEditors && (
        <Link to={editorsLink} className='left-homepage' style={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }}>
         
          <div className='editor'>
          
             <Link
                to="/editors-pick" className='sticker'>
                EDITOR'S PICKS
              </Link>
          </div>
          
          <div className='editor-text'>
              <p className='editor-text-header'>
                {highlightedEditors.title || 'Loading...'}
              </p>
              <p className='editor-text-body'>
                {highlightedEditors.summary}
              </p>
         </div>
         </Link>)}
        <div className='right-homepage'>
          {highlightedNews && (

          <Link to={newsLink} className='news-component' style={{ backgroundImage: `url(${highlightedNews ? highlightedNews.image : ''})` }}>
            <div className='editor'>
              <Link to='/news' className='sticker'>
                NEWS
              </Link>
            </div>
            <div className='news-text'>
              <p className='news-text-header'>
                {highlightedNews ? highlightedNews.title || 'Loading...' : ''}
              </p>
              <p className='news-text-body'>
                {highlightedNews ? highlightedNews.summary  : ''}
              </p>
              </div>
            </Link>)}

            {highlightedPlaylists.map((playlist) => (
          <div key={playlist.id} className='playlist-component'>
            <a href={playlist.link} target='_blank' rel='noopener noreferrer'>
            <div className='playlist-text' >
              <Link to='/playlists' className='sticker'>
                PLAYLISTS
              </Link>
            </div>
            <button className='playlist-button' onClick={()=> window.open(playlist.link, '_blank')}>Listen</button>
            <img src={playlist.imageUrl} alt={playlist.title} className='highlighted-playlist-image' />
            </a>
          </div>
            ))}
        </div>
      </div>
      <div className='bottom-homepage'>

        {/* Map over the featuredAd array to create links with background images */}
        {newFeaturedAd.map((ad) => (
          <Link key={ad.id} to={ad.link} className='featured-ad'>
            <img src={ad.imageUrl} alt={ad.title} className='ad'/>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
