import React, {useEffect, useState} from 'react';
import HomePages from '../pages/homePage/HomePages';
import {
  BrowserRouter as Router,
  Route,Routes,
  Link
} from 'react-router-dom';
import { database } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs } from '@firebase/firestore';
import { Share } from '@mui/icons-material';




const ArticleSide = () => {
  const [highlightedNews, setHighlightedNews] = useState(null); 
  const [highlightedEditors, setHighlightedEditors] = useState(null); 
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

  const editorsLink = highlightedEditors ? `/article/editors-picks/${highlightedEditors.id}` : '';
  const newsLink = highlightedNews ? `/article/news/${highlightedNews.id}` : '';

  return (
    <div className='article-side'>
     
      <div className='aside-header'>You Might Also Like</div> 
      <div className='aside-articles'> 

        <div className='flex-aside-article'>
          <Link to={newsLink} style={{ backgroundImage: `url(${highlightedNews ? highlightedNews.image : ''})` }} className='aside-article'>
              <p className='article-title-text'>
                {highlightedNews ? highlightedNews.title : ''}
              </p>
           </Link>
           <div className='aside-article-side'>
            <Link to={newsLink} className='article-description'>{highlightedNews ? highlightedNews.title : ''}</Link>
          <Link to='/news' className='link-to-section'>See more News</Link>
          </div>
       </div>

       <div className='flex-aside-article'>
          <Link to={editorsLink}  style={{ backgroundImage: `url(${highlightedEditors ? highlightedEditors.image : ''})` }} className='aside-article'>
            <p className='article-title-text'>
              {highlightedEditors ? highlightedEditors.title : ''}
            </p>
          </Link>
          <div className='aside-article-side'>
          <Link to={editorsLink} className='article-description'>{highlightedEditors ? highlightedEditors.title : ''}</Link>
          <Link to="/editors-pick" className='link-to-section'>
            See more Editor's Picks</Link>
            </div>
        </div>

        <div className='flex-aside-article'>
          {highlightedPlaylists.map((playlist) => (
          <div key={playlist.id} className='aside-playlist'>
            <a href={playlist.link} target='_blank' rel='noopener noreferrer'>
            {/* <button className='playlist-button' onClick={()=> window.open(playlist.link, '_blank')}>Listen</button> */}
              <img src={playlist.imageUrl} alt={playlist.title} className='aside-playlist-image' />
            </a>
          </div>
            ))}
            <div className='aside-playlist-side'>
            <Link to='/playlists' className='article-description'>HERE FOR THE MUSIC? CHECK OUT AWESOME PLAYLISTS</Link>
            <Link to='/playlists' className='link-to-section'>See more Playlists</Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleSide;