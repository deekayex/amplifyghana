
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database} from '../../firebase/firebase';
import './ArticlePage.css'

const ArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleRef = doc(database, 'news', articleId);
        const articleDoc = await getDoc(articleRef);

        if (articleDoc.exists()) {
          setArticle(articleDoc.data());
        } else {
          console.error('Article not found');
        }
      } catch (error) {
        console.error('Error fetching article', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  return (
    <div className="article-page">
      <div className='spacer' />
        <div className='article-flex'>
          <div className='article-main'>
            {article && (
              <>
            <h1 className='article-title'>{article.title}</h1>
          <div className='article-image-container'>
            <img src={article.image} alt="Article" className='article-image' />
          </div>
          
          <div className='article-body'>{article.content}</div>
              </>
            )}
          </div>
        </div>
        <div className='article-aside'>

        </div>
    </div>
  );
};

export default ArticlePage;
