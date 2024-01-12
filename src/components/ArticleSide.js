import React, {useEffect, useState} from 'react';
import HomePages from '../pages/homePage/HomePages';
import {
  BrowserRouter as Router,
  Route,Routes,
  Link
} from 'react-router-dom';
import { database } from '../firebase/firebase';
import { doc, getDoc } from '@firebase/firestore';




const ArticleSide = () => {
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
    <div className='article-side'>
      <div className='aside-header'>You Might Also Like</div> 
      <div className='aside-articles'> 
        
          <div style={{ backgroundImage: `url(${highlightedNews ? highlightedNews.image : ''})` }} className='aside-article'>
            <div className='editor'>News</div>
        <div >
          <p className='article-title-text'>
            {highlightedNews ? highlightedNews.title : 'Loading...'}
          </p>
        </div>
      </div>

      <div style={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }} className='aside-article'>
        <div className='editor'>Editors</div>

        <p className='article-title-text'>
           {highlightedEditors ? highlightedEditors.title : 'Loading...'}
        </p>
      </div>
      {/* <div>Playlists</div> */}
      </div>
    </div>
  )
}

export default ArticleSide;