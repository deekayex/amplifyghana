import React, { useEffect, useState } from 'react';
import './News.css';
import { database} from '../../firebase/firebase';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, orderBy, query } from '@firebase/firestore';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LoadingArticles from '../../context/loading/ArticlesLoad/LoadingArticles';


const News = ({ isAllArticlesPage }) => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [highlightedArticleId, setHighlightedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centeredStates, setCenteredStates] = useState({});


  const handleToggleClick = async (articleId) => {
  try {
    const articleDocRef = doc(database, 'centeredStates', articleId);
    const articleDoc = await getDoc(articleDocRef);

    if (articleDoc.exists()) {
      // If the document exists, update the centered state
      const currentCenteredState = articleDoc.data().centeredState;
      const newCenteredState = !currentCenteredState;

      await updateDoc(articleDocRef, {
        centeredState: newCenteredState,
      });
    } else {
      // If the document doesn't exist, create a new one
      await setDoc(articleDocRef, {
        centeredState: true, // Initial state
      });
    }

    // Fetch the updated centered states
    const updatedCenteredStates = await fetchCenteredStates();
    setCenteredStates(updatedCenteredStates);

  } catch (error) {
    console.error('Error toggling centered state:', error);
  }
};

const fetchCenteredStates = async () => {
  const centeredStatesCollection = collection(database, 'centeredStates');
  const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

  const centeredStates = {};
  centeredStatesSnapshot.forEach((doc) => {
    centeredStates[doc.id] = doc.data().centeredState;
  });

  return centeredStates;
};

// Call fetchCenteredStates once to initialize the state
useEffect(() => {
  const initializeCenteredStates = async () => {
    const initialCenteredStates = await fetchCenteredStates();
    setCenteredStates(initialCenteredStates);
  };

  initializeCenteredStates();
}, []);


  const handleSetHighlight = async (articleId) => {
    try {
      await setDoc(doc(database, 'highlighted', 'highlightedNews'), {
        articleId,
      });

      setHighlightedArticleId(articleId);
      alert('Article set as highlight successfully!');
    } catch (error) {
      console.error('Error setting highlight:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const highlightedArticleDoc = await getDoc(
          doc(database, 'highlighted', 'highlightedNews')
        );
        const highlightedArticleData = highlightedArticleDoc.data();

        if (highlightedArticleData) {
          setHighlightedArticleId(highlightedArticleData.articleId);
        }

        // Fetch all news articles
        const newsCollection = collection(database, 'news');
        const newsQuery = query(newsCollection, orderBy('timestamp', 'desc'));
        const newsSnapshot = await getDocs(newsQuery);
        const articles = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsArticles(articles);
      } catch (error) {
        console.error('Error fetching news articles', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteArticles = async (id) => {
    if (isAllArticlesPage) {
      const newsDoc = doc(database, 'news', id);
      await deleteDoc(newsDoc);
      setNewsArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
    } else {
      alert('You are not allowed to delete any article here');
    }
  };

  const articlesPerPage = 6;
  const totalArticles = newsArticles.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerRow, setArticlesPerRow] = useState(getArticlesPerRow());

  useEffect(() => {
    const handleResize = () => {
      setArticlesPerRow(getArticlesPerRow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
  const currentArticles = newsArticles.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(totalArticles / articlesPerPage)));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  function getArticlesPerRow() {
    return window.innerWidth >= 700 ? 3 : 2;
  }

  return (
    <section className='news-container' id='news'>
      <div className='spacer' />
      <div className='page-header'>
        <img src={process.env.PUBLIC_URL + '/newspaper-folded.png'} alt='News icon' className='news-icon' />
        NEWS
      </div>

      <div className='flex-contents'>
        {isLoading ? (
          <LoadingArticles />
        ) : (
          <div className='page-contents'>
            {Array.from({ length: articlesPerRow }).map((_, colIndex) => (
              <div key={colIndex} className='news-row'>
                {currentArticles
                  .filter((article, index) => index % articlesPerRow === colIndex)
                  .map((article, rowIndex) => (
                    <Link
                      to={user && isAllArticlesPage && !article.isHighlight ? '#' : `/article/news/${article.id}`}
                      key={rowIndex}
                    >
                      <div
                        className={`content-card ${centeredStates[article.id] ? 'centered' : ''} `}
                        style={{ backgroundImage: `url(${article ? article.image : ''})` }}
                      >
                        <div className='card-manager'>
                        {user && isAllArticlesPage && (
                          <button onClick={() => handleDeleteArticles(article.id)}>Delete</button>
                        )}
                          {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleToggleClick(article.id)}>Change Center</button>
                        )}
                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleSetHighlight(article.id)}>Set as News Highlight</button>
                        )}
                      </div>
                        <div className='content-text'>
                          <p className='content-text-header'>{article.title}</p>
                          <p className='content-text-body'>{article.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className='page-button'>
          Back
        </button>
        <span className='page-number'>
          Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(totalArticles / articlesPerPage)}
          className='page-button'
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default News;
