import React, { useState, useEffect } from 'react';
import { database, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, setDoc, orderBy, query, updateDoc } from '@firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Authentication functions
import LoadingScreen from '../../context/loading/LoadingScreen';
import LoadingArticles from '../../context/loading/ArticlesLoad/LoadingArticles';

function EditorsPicks({isAllArticlesPage}) {
  const [editorsArticles, setEditorsArticles] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [isLoading, setIsLoading] = useState(true);
  const [, setHighlightedArticleId] = useState(null);
  const [, setHighlightedEditors] = useState(null);
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
      await setDoc(doc(database, 'highlighted', 'highlightedEditors' ), {
        articleId,
      });

      setHighlightedArticleId(articleId);
      alert('Article set as highlight successfully!');
    } catch (error) {
      console.error('Error setting highlight:', error);
    }
  };

  useEffect(() => {
    const fetchHighlightedEditors = async () => {
      try {
        const highlightedEditorsDoc = await getDoc(
          doc(database,'highlighted', 'highlightedEditors' )
        );
        const highlightedEditorsData = highlightedEditorsDoc.data();

        if (highlightedEditorsData) {
          const articleRef = doc(database, 'editors-picks', highlightedEditorsData.articleId);
          const articleDoc = await getDoc(articleRef);

          if (articleDoc.exists()) {
            setHighlightedEditors(articleDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching highlighted article', error);
      }
    };

    const fetchData = async () => {
      try {
        const editorsCollection = collection(database, 'editors-picks');
        const editorsQuery = query(editorsCollection, orderBy('timestamp', 'desc'));
        const editorsSnapshot = await getDocs(editorsQuery);
        const articles = editorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEditorsArticles(articles);
      } catch (error) {
        console.error('Error fetching news articles', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightedEditors();
    fetchData();

    // Add listener for authentication state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the subscription to avoid memory leaks
    return () => unsubscribe();
  }, []);


  const handleDeleteArticles = async (id) => {
    const newsDoc = doc(database, 'editors-picks', id);
    await deleteDoc(newsDoc);

    setEditorsArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
  };

  const articlesPerPage = 6;
  const totalArticles = editorsArticles.length;
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
  const currentArticles = editorsArticles.slice(startIndex, endIndex);

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
    <section className='editor-page' id='editors-pick'>
      <div className='editor_space' />
      <div className='page-header'>
        <img src={process.env.PUBLIC_URL + '/newspaper-folded.png'} alt='News icon' className='news-icon' />
        Editor's Picks
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
                    <Link to={user && isAllArticlesPage && !article.isHighlight ? '#' :`/article/editors-picks/${article.id}`} key={colIndex}>
                      <div key={colIndex} className={`content-card ${centeredStates[article.id] ? 'centered' : ''}`} style={{backgroundImage: `url(${article ? article.image : ''})`}}>

                      <div className='card-manager'>
                        {user && isAllArticlesPage && (
                          <button onClick={() => handleDeleteArticles(article.id)}>Delete</button>
                        )}

                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleToggleClick(article.id)}>Change Center</button>
                        )}

                        {user && !article.isHighlight && isAllArticlesPage && (
                          <button onClick={() => handleSetHighlight(article.id)}>
                            Set as Editor's Highlight 
                          </button>
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
      <div className='pagination' >
        <button onClick={handlePrevPage} disabled={currentPage === 1} className='page-button'>
          Back
        </button>
        <span>Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}</span>
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
}

export default EditorsPicks;
