import React, { useState, useEffect } from 'react';
import { database, storage } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from '@firebase/firestore';
import { Link } from 'react-router-dom';
import CreateArticleForm from '../../components/forms/editor/CreateArticleForm';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Authentication functions

function EditorsPicks() {
  const [editorsArticles, setEditorsArticles] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [user, setUser] = useState(null); // State to track the authenticated user

  useEffect(() => {
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
      }
    };

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
      const { title, content, image, section } = newArticleData;

      const storageRef = ref(storage, `article_images/${image.name}`);
      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      const collectionName = section === 'news' ? 'news' : 'editors-picks';

      // Add the new article to the Firestore collection with the image URL
      const newArticleRef = await addDoc(collection(database, collectionName), {
        title,
        content,
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
    return window.innerWidth >= 1000 ? 2 : 3;
  }

  return (
    <section className='home-page' id='editors-pick'>
      <div className='space' />
      <div className='page-header'>
        <img src={process.env.PUBLIC_URL + '/newspaper-folded.png'} alt='News icon' className='news-icon' />
        EditorsPicks
      </div>

      <div className='flex-container'>
        <div className='create-article-form-container'>
          {isCreateFormVisible && user ? (
            <CreateArticleForm onSave={handleSaveNewArticle} onCancel={() => setCreateFormVisible(false)} />
          ) : user ? (
            <button className='create-article' onClick={() => setCreateFormVisible(true)}>
              Create New Article
            </button>
          ) : null}
        </div>
      </div>

      <div className='flex-contents'>
        <div className='page-contents'>
          {Array.from({ length: Math.ceil(currentArticles.length / articlesPerRow) }).map((_, rowIndex) => (
            <div key={rowIndex} className='news-row'>
              {currentArticles
                .slice(rowIndex * articlesPerRow, (rowIndex + 1) * articlesPerRow)
                .map((article, colIndex) => (
                  <Link to={`/article/${article.id}`} key={colIndex}>
                    <div key={colIndex} className='content-card'>
                      {user && <button onClick={() => handleDeleteArticles(article.id)}>Delete</button>}
                      <img src={article.image} alt={article.title} className='content-pic' />
                      <div className='content-text'>
                        <p className='content-text-header'>{article.title}</p>
                        <p className='content-text-body'>{article.content}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className='pagination'>
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
