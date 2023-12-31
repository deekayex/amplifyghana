import React, { useEffect, useState } from 'react';
import './News.css';
import { database } from '../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from '@firebase/firestore';
import { Link } from 'react-router-dom';
import CreateArticleForm from '../../components/editor/CreateArticleForm';
import ArticleRemover from '../../components/editor/ArticleRemove';

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [isArticleRemoverVisible, setArticleRemoverVisible] = useState(false); // Corrected the state name

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const newsCollection = collection(database, 'news');
        const newsSnapshot = await getDocs(newsCollection);
        const articles = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsArticles(articles);
        console.log(articles);
      } catch (error) {
        console.error('Error fetching news articles', error);
      }
    };

    fetchData();
  }, []);

  const handleSaveNewArticle = async (newArticleData) => {
    try {
      const newArticleRef = await addDoc(collection(database, 'news'), newArticleData);
      alert('New article created successfully!');
      setCreateFormVisible(false);
    } catch (error) {
      console.error('Error creating new article', error);
    }
  };

 


  const handleDeleteArticles = async (id) => {
    const newsDoc = doc(database, "news", id )
    await deleteDoc(newsDoc);

    setNewsArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
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
    return window.innerWidth >= 1000 ? 2 : 3;
  }

  return (
    <section className='news-container' id='news'>
      <div className='spacer' />
      <div className='page-header'>
        <img src={process.env.PUBLIC_URL + '/newspaper-folded.png'} alt='News icon' className='news-icon' />
        NEWS
      </div>

      <div className='flex-container'>
        <div className='create-article-form-container'>
          {isCreateFormVisible ? (
            <CreateArticleForm onSave={handleSaveNewArticle} onCancel={() => setCreateFormVisible(false)} />
          ) : (
            <button className='create-article' onClick={() => setCreateFormVisible(true)}>
              Create New Article
            </button>
          )}
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
                    <div className='content-card'>
                      <button onClick={()=> handleDeleteArticles(article.id)}>Delete</button>
                      <img src={article.image} alt='news' className='content-pic' />
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
        <span className='page-number'>
          Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalArticles / articlesPerPage)} className='page-button'>
          Next
        </button>
      </div>
    </section>
  );
};

export default News;
