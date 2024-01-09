import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase/firebase';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './ArticlePage.css';
import LoadingScreen from '../../context/loading/LoadingScreen';
import ArticleSide from '../../components/ArticleSide';

const ArticlePage = () => {
  const { articleId, category } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(database, category, articleId);
        const articleDoc = await getDoc(articleRef);

        if (articleDoc.exists()) {
          setArticle(articleDoc.data());
        } else {
          console.error('Article not found');
        }
      } catch (error) {
        console.error('Error fetching article', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [category, articleId]);

  return (
    <div className="article-page">
      <div className='spacer' />
      <div className='article-flex'>
        {isLoading ? (
          <LoadingScreen/>
        ) : (
          <div className='article-main'>
            {article && (
              <>
                <h1 className='article-title'>{article.title}</h1>
                <div className='article-image-container'>
                  <img src={article.image} alt="Article" className='article-image' />
                </div>

                {/* Use DOMPurify to sanitize and render HTML content */}
                <div
                  className='article-body'
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
              </>
            )}
          </div>
        )}
      
      <div className='article-aside'>
        <ArticleSide/>
      </div>
      </div>
    </div>
  );
};

export default ArticlePage;
