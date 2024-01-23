import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase/firebase';
import DOMPurify from 'dompurify'; // Import DOMPurify
import './ArticlePage.css';
import LoadingScreen from '../../context/loading/LoadingScreen';
import ArticleSide from '../../components/ArticleSide';
import Share from '../../components/share/Share';
import Connect from '../../components/connect/Connect';



const ShareButton = ({ articleTitle, articleUrl }) => {
  const handleShare = () => {

    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        text: 'Check out this article!',
        url: articleUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support Web Share API
      console.log('Web Share API not supported');
    }
  };

  return (
    <div className="share-container">
      <div className="share-social">
        <Share articleTitle ={articleTitle} articleUrl={articleUrl}/>
      </div>
      <button className="share-button" onClick={handleShare}>
      <img
          src={process.env.PUBLIC_URL + "/share.svg"} 
          alt="Share This Article" className='share-icon'/>
          
      </button>
      
    </div>
  );
};


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

  

  const renderArticleContent = () => {
    
    if (article) {
      // Use DOMPurify to sanitize and render HTML content
      const sanitizedContent = DOMPurify.sanitize(article.content, {
        ADD_ATTR: ['target'], // Allow adding 'target' attribute
        FORBID_TAGS: ['script'], // Forbid script tags
      });
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedContent, 'text/html');
  
      // Insert your div with content in the middle of the article
      const insertionDiv = document.createElement('div');
      insertionDiv.innerHTML = '<div>Ad goes here</div>';
  
     // Find the middle position
      const paragraphTags = doc.querySelectorAll('p');
      const middlePosition = Math.floor(paragraphTags.length / 2);

      // Insert the new div at the middle position
      const targetElement = paragraphTags[middlePosition];
      if (targetElement) {
        targetElement.insertAdjacentElement('afterend', insertionDiv);
      }
  
  
      doc.querySelectorAll('img').forEach((image) => {
        const altText = image.getAttribute('alt');
        if (altText) {

          // Create a container for the image and alt text
          const container = document.createElement('div');
          container.style.display = 'flex'; 
          container.style.flexDirection = 'column';
          // container.style.backgroundColor = 'green'
          container.className = 'image-container';
  
          // Append the image to the container
          const styledImage = image.cloneNode(true);
          styledImage.style.margin = '0'; 
          styledImage.style.padding = '0'; 
          // styledImage.style.marginBottom = '10px'; 

          container.appendChild(styledImage);
  
          // Create a paragraph for the alt text
          const altElement = document.createElement('p');
          altElement.textContent = altText;

          // Add styles for flexbox layout
          altElement.style.margin = '0'; // Set margin to zero
          altElement.style.paddingTop = '2px'; 
          // altElement.style.backgroundColor = 'blue';
          altElement.style.textAlign = 'center';
          altElement.style.fontSize ='1.3rem'
          altElement.style.color= '#666666';
          altElement.style.fontFamily ='Papyrus, fantasy';
          altElement.style.fontWeight = '200';

  
          // Append the alt text to the container
          container.appendChild(altElement);

  
          // Replace the original image with the container
          image.parentNode.replaceChild(container, image);
        }
      });

      return (
        <div className='article-body'>
          <div dangerouslySetInnerHTML={{ __html: modifyLinkTargets(doc.body.innerHTML) }} />
        </div>
      );
    }

    return null;
  };

  // Modify the link targets to open in a new window
  const modifyLinkTargets = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    doc.querySelectorAll('a').forEach((link) => {
      link.setAttribute('target', '_blank');
    });

    return doc.body.innerHTML;
  };

  return (
    <div className="article-page">
      <div className='spacer' />
      {isLoading ? (
          <LoadingScreen/>
        ) : (
      <div className='article-flex'>
          <div className='article-main'>
            {article && (
              <>
                <h1 className='article-title'>{article.title}</h1>
                <div className='article-image-container'>
                  <img src={article.image} alt="Article" className='article-image' />
                </div>
                <div className='read-article'>
                 {/* Add the ShareButton component */}
                 <ShareButton articleTitle={article.title} articleUrl={`/article/${category}/${articleId}`} className='external-share'/>                
                {renderArticleContent()}
                </div>
                
              </>
            )}

            <Connect/>
            
          </div>
      
      <div className='article-aside'>
        <ArticleSide/>
      </div>
      </div>
     )} </div>
  );
};

export default ArticlePage;
