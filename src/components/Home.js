import React, { useState, useEffect } from 'react';
import './Home.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { database } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';

function Home() {
  const [highlightedNews, setHighlightedNews] = useState(null); // State to track the highlighted news
  const [highlightedEditors, setHighlightedEditors] = useState(null); // State to track the highlighted editors

  const [highlightedPlaylists, setHighlightedPlaylists] = useState([]);


  useEffect(() => {
    const fetchHighlightedNews = async () => {
      try {
        // Fetch the highlighted news from Firebase
        const highlightedNewsDoc = await getDoc(
          doc(database, 'highlighted', 'highlightedNews')
        );
        const highlightedNewsData = highlightedNewsDoc.data();

        if (highlightedNewsData) {
          // Fetch the detailed information of the highlighted news
          const articleRef = doc(database, 'news', highlightedNewsData.articleId);
          const articleDoc = await getDoc(articleRef);

          if (articleDoc.exists()) {
            setHighlightedNews({id: articleDoc.id, ...articleDoc.data()});
          }
        }
      } catch (error) {
        console.error('Error fetching highlighted news', error);
      }
    };

    const fetchEditorsHighlight = async () => {
      try {
        // Fetch the highlighted editors from Firebase
        const highlightedEditorsDoc = await getDoc(
          doc(database, 'highlighted', 'highlightedEditors')
        );

        const highlightedEditorsData = highlightedEditorsDoc.data();

        if (highlightedEditorsData) {
          // Fetch the detailed information of the highlighted editors
          const articleRef = doc(database, 'editors-picks', highlightedEditorsData.articleId);
          const articleDoc = await getDoc(articleRef);

          if (articleDoc.exists()) {
            setHighlightedEditors({ id: articleDoc.id, ...articleDoc.data() });
          }
        }
      } catch (error) {
        console.error('Error fetching highlighted editors', error);
      }
    };

    const fetchHighlightedPlaylists = async () => {
      try {
        const highlightsCollectionRef = collection(database, 'Playlisthighlights');
        const querySnapshot = await getDocs(highlightsCollectionRef);
    
        // Check if there are any documents in the collection
        if (!querySnapshot.empty) {
          const playlists = [];
    
          // Iterate over the documents in the collection
          querySnapshot.forEach((doc) => {
            // Extract data from each document and add it to the playlists array
            playlists.push({ id: doc.id, ...doc.data() });
          });
    
          // Set the fetched data in the state
          setHighlightedPlaylists(playlists);

        } else {
          console.error('No documents found in Playlisthighlights collection');
        }

      } catch (error) {
        console.error('Error fetching highlighted playlist', error);
      }
    };

    fetchHighlightedNews();
    fetchEditorsHighlight();
    fetchHighlightedPlaylists();
  }, []);

  // Add a check for highlightedEditors before accessing its properties
  const editorsLink = highlightedEditors ? `/article/editors-picks/${highlightedEditors.id}` : '';
  const newsLink = highlightedNews ? `/article/news/${highlightedNews.id}` : '';

  return (
    <div className='homepage-components'>
      <div className='homepage-contents'>
        {highlightedEditors && (
        <Link to={editorsLink} className='left-homepage' style={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }}>
         
          <div className='editor'>
          
             <Link
                smooth
                to="/#editors-pick" className='sticker'>
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
            <div className='editor-text'>
              <p className='news-text-header'>
                {highlightedNews ? highlightedNews.title || 'Loading...' : ''}
              </p>
              <p className='editor-text-body'>
                {highlightedNews ? highlightedNews.summary  : ''}
              </p>
              </div>
            </Link>)}

            {highlightedPlaylists.map((playlist) => (
          <div key={playlist.id} className='playlist-component'>
            <Link>
            <div className='playlist-text' >
              <Link to='/playlists' className='sticker'>
                PLAYLISTS
              </Link>
            </div>
            <button className='playlist-button' onClick={()=> window.open(playlist.link, '_blank')}>Listen</button>
            <img src={playlist.imageUrl} alt={playlist.title} className='highlighted-playlist-image' />
            </Link>
          </div>
            ))}
        </div>
      </div>
      <div className='bottom-homepage'>
        <Link>
          <p className='ad-section'>PLACE AN AD</p>
          <p className='rent-space'>
            SEND AN EMAIL TO AMPLIFYGH@GMAIL.COM IF YOU WANT THIS SPACE
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
