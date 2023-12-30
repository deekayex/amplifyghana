
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
      {article && (
        <>
          <h1>{article.title}</h1>
          <img src={article.image} alt="Article" />
          <p>{article.content}</p>
        </>
      )}
    </div>
  );
};

export default ArticlePage;
