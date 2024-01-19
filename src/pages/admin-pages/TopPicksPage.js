import React, {useEffect, useState} from 'react'
import { database } from '../../firebase/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { NavLink } from 'react-router-dom';
import HighlightedEditors from '../../components/highlighted/HighlightedEditors';



const TopPicksPage = () => {
  const [highlightedNews, setHighlightedNews] = useState(null);
  const [highlightedEditors, setHighlightedEditors] = useState(null);

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

    fetchHighlightedNews();
    fetchEditorsHighlight();
  }, []);

  return (
    <div className='top-picks-page'>TopPicksPage
      <div className='top-picks-container'>
        
        {highlightedEditors && <HighlightedEditors highlightedEditors={highlightedEditors} />}
        {highlightedNews && <highlightedNews highlightedNews={highlightedNews} />}</div>
      <div className='top-links'>
        <NavLink to='/admin/all-articles' className='link'>Highlight Article</NavLink>
        <NavLink to= '/admin/top-playlist' className='link'>Highlight Playlist</NavLink>
      </div>
    </div>
  )
}

export default TopPicksPage