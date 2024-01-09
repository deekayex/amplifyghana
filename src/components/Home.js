import React, {useState, useEffect} from 'react'
import './Home.css'
import {
  BrowserRouter as Router,
  Route,Routes,
  Link
} from 'react-router-dom';
import { database } from '../firebase/firebase';
import { doc, getDoc } from '@firebase/firestore';

function Home() {
  const [highlightedNews, setHighlightedArticle] = useState(null); // State to track the highlighted article
  

  useEffect(() => {
    const fetchHighlightedNews = async () => {
      try {
        // Fetch the highlighted article from Firebase
        const highlightedArticleDoc = await getDoc(
          doc(database, 'highlighted','highlightedNews')
        );
        const highlightedArticleData = highlightedArticleDoc.data();

        if (highlightedArticleData) {
          // Fetch the detailed information of the highlighted article
          const articleRef = doc(database, 'news', highlightedArticleData.articleId);
          const articleDoc = await getDoc(articleRef);

          if (articleDoc.exists()) {
            setHighlightedArticle(articleDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching highlighted article', error);
      }
    };

    fetchHighlightedNews();
  }, []);

  const [highlightedEditors, setHighlightedEditors] = useState(null); // State to track the highlighted article


  useEffect(() => {
    const fetchEditoitorsHighlight = async () => {
      try {
        // Fetch the highlighted article from Firebase
        const highlightedArticleDoc = await getDoc(
          doc(database, 'highlighted','highlightedEditors')
        );
        const highlightedArticleData = highlightedArticleDoc.data();

        if (highlightedArticleData) {
          // Fetch the detailed information of the highlighted article
          const articleRef = doc(database, 'editors-picks', highlightedArticleData.articleId);
          const articleDoc = await getDoc(articleRef);

          if (articleDoc.exists()) {
            setHighlightedEditors(articleDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching highlighted article', error);
      }
    };

    fetchEditoitorsHighlight();
  }, []);



  return (
    <div className='homepage-components'>
      <div className='homepage-contents'>
        <div className='left-homepage' style={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }}>
          <Link >

            <div className='editor'>
              <Link to='editors-pick'>
              EDITOR'S PICK
              </Link>
            </div>

            <div className='editor-text'>
               <p className='editor-text-header'>
                  {highlightedEditors ? highlightedEditors.title : 'Loading...'}
                </p>
                <p className='editor-text-body'>
                  {highlightedEditors ? highlightedEditors.summary : 'Loading...'}
                </p>
            </div>
          </Link>
        </div>
        <div className='right-homepage'>
          <div className='news-component'style={{ backgroundImage: `url(${highlightedNews ? highlightedNews.image : ''})` }}>
            
            <div className='editor'>
              <Link to="/news">
                NEWS
              </Link>
            </div>
            <div className='editor-text'>
                <p className='news-text-header'>
                  {highlightedNews ? highlightedNews.title : 'Loading...'}
                </p>
                <p className='editor-text-body'>
                  {highlightedNews ? highlightedNews.summary : 'Loading...'}
                </p>
              </div>
            
         </div>
          <div className='playlist-component'>
            
          
          <div className='playlist-text'>
          <Link to="/playlists">
             PLAYLISTS
           </Link>
          </div>
          <button className='playlist-button'>Listen</button>
         
         </div>
       </div>
      </div>
      <div className='bottom-homepage'>
        <Link>
        <p className='ad-section'>  PLACE AN AD</p>
        <p className='rent-space'>
        SEND AN EMAIL TO AMPLIFYGH@GMAIL.COM IF YOU WANT THIS SPACE
        </p>
        </Link>
      </div>
  </div>
  )
}

export default Home