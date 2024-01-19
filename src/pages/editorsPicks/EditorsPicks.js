import React, { useState, useEffect } from 'react';
import { database, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, setDoc } from '@firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Authentication functions
import LoadingScreen from '../../context/loading/LoadingScreen';

function EditorsPicks({isAllArticlesPage}) {
  const [editorsArticles, setEditorsArticles] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [isLoading, setIsLoading] = useState(true);
  const [, setHighlightedArticleId] = useState(null);
  const [, setHighlightedEditors] = useState(null);

  const handleSetHighlight = async (articleId) => {
    try {
      // Update the 'highlightedArticleId' in Firebase to set the currently highlighted article
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
          // Fetch the highlighted article using the articleId from the Firestore document
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
        const editorsSnapshot = await getDocs(editorsCollection);
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

  const handleSaveNewArticle = async (newArticleData) => {
    try {
      const { title, image, summary, section } = newArticleData;

      const storageRef = ref(storage, `article_images/${image.name}`);
      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      const collectionName = section === 'news' ? 'news' : 'editors-picks';

      // Add the new article to the Firestore collection with the image URL
      const newArticleRef = await addDoc(collection(database, collectionName), {
        title,
        summary,
        image: downloadURL, // Use the URL obtained from Firebase Storage
      });

      alert('New article created successfully!');
      setCreateFormVisible(false);
    } catch (error) {
      console.error('Error creating new article', error);
    }
  };

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
          <LoadingScreen />
        ) : (
          <div className='page-contents'>

            {/* Display the rest of the articles */}
            {Array.from({ length: articlesPerRow }).map((_, colIndex) => (
            <div key={colIndex} className='news-row'>
              {currentArticles
                .filter((article, index) => index % articlesPerRow === colIndex)
                .map((article, rowIndex) => (
                    <Link to={`/article/editors-picks/${article.id}`} key={colIndex}>
                      <div key={colIndex} className='content-card' style={{backgroundImage: `url(${article ? article.image : ''})`}}>
                        {user && isAllArticlesPage && (
                          <button onClick={() => handleDeleteArticles(article.id)}>Delete</button>
                        )}
                        {user && !article.isHighlight && isAllArticlesPage && (
                          <button onClick={() => handleSetHighlight(article.id)}>
                            Set as Editor's Highlight 
                          </button>
                        )}
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
