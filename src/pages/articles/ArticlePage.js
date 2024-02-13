import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { database } from '../../firebase/firebase';
import DOMPurify from 'dompurify';
import './ArticlePage.css';
import LoadingScreen from '../../context/loading/LoadingScreen';
import ArticleSide from '../../components/ArticleSide';
import Share from '../../components/share/Share';
import Connect from '../../components/connect/Connect';
import { useLocation } from 'react-router-dom';
import ScrollToTopOnMount from '../../components/ScrollToTop';

const ShareButton = ({ articleTitle, articleUrl, articleImageSrc }) => {
  const handleShare = () => { 
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        text: 'Check out this article!',
        url: articleUrl,
        image: articleImageSrc
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported');
    }
  };

  return (
    <div className="share-container">
      <Helmet>
        <title>{articleTitle}- Amplify Ghana</title>
        <meta property="og:image" content={articleImageSrc}/>
        <meta name="description" content={articleTitle} />
       
      </Helmet>
      <div className="share-social">
        <Share articleTitle={articleTitle} articleUrl={articleUrl} />
      </div>
      <button className="share-button" onClick={handleShare}>
        <img src={process.env.PUBLIC_URL + '/share.svg'} alt="Share This Article" className="share-icon" />
      </button>
    </div>
  );
};


const ArticlePage = () => {
  const { articleId, category } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const ad = location.state?.ad;
  const [featuredAdElements, setFeaturedAdElements] = useState([]);


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FeaturedAd data
        const featuredAdSnapshot = await getDocs(collection(database, 'FeaturedAd'));
  
        if (!featuredAdSnapshot.empty) {
          // Directly access the data of the first document
          const adData = featuredAdSnapshot.docs[0].data();
          console.log('Fetched FeaturedAd:', adData);
  
          // Set the single ad data to the state variable
          setFeaturedAdElements([adData]);
        } else {
          console.error('No documents found in FeaturedAd collection');
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const renderFeaturedAd = () => {
    if (featuredAdElements.length > 0) {
      // Render the first featured ad
      const ad = featuredAdElements[0];
  
      const container = document.createElement('div');
      container.innerHTML = `
        <a href="${ad.link}" target="_blank" rel="noopener noreferrer" class='featured-ad'>
          <img src="${ad.imageUrl}" alt="Featured Ad" class='ad' />
        </a>
      `;
  
      return container;
    }

  
    return null;
  };
  
  

  const renderArticleContent = () => {
    if (article) {

      const sanitizedContent = DOMPurify.sanitize(article.content, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
      });

  
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitizedContent, 'text/html');
  
      // Insert the rendered featured ad into the middle of the article
      const paragraphTags = doc.querySelectorAll('p');
      const middlePosition = Math.floor(paragraphTags.length / 2);
  
      const renderedFeaturedAd = renderFeaturedAd();
  
      if (middlePosition >= 0 && renderedFeaturedAd) {
        const targetElement = paragraphTags[middlePosition];
        targetElement.insertAdjacentElement('afterend', renderedFeaturedAd);
        console.log('Rendered Featured Ad:', renderedFeaturedAd);
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

      doc.querySelectorAll('iframe').forEach((iframe) => {
              // Create a container for the iframe
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        // Add additional styles as needed

        // Append the iframe to the container
        const styledIframe = iframe.cloneNode(true);
        // Apply styles to the iframe as needed
        styledIframe.style.margin = '0';
        styledIframe.style.padding = '0';
        styledIframe.style.maxWidth ='90vw';

        container.appendChild(styledIframe);

        // Replace the original iframe with the container
        iframe.parentNode.replaceChild(container, iframe);
        });





      return (
        <div className='article-body'>
          <div dangerouslySetInnerHTML={{ __html: modifyLinkTargets(doc.body.innerHTML) }} />
        </div>
      );
    }

    return null;
  };

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
      <ScrollToTopOnMount/>
     
      
      <div className='spacer' />
      {isLoading ? (
          <LoadingScreen/>
        ) : (
      <div className='article-flex'>
          <div className='article-main'>
            {article && (
              <>
              <Helmet>
                <title>{article.title}- Amplify Ghana</title>
                <meta property="og:image" content={article.image}/>
                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:image" content={article.image}/>
                <meta property="twitter:title" content={article.title}/>
                <link rel='canonical' href={`/article/${category}/${articleId}`}></link>
                <meta name="robots" content="index, follow"/> 
              </Helmet>
                <h1 className='article-title'>{article.title}</h1>
                <div className='article-image-container'>
                  <img src={article.image} alt="Article" className='article-image' />
                </div>
                <div className='read-article'>
                 <ShareButton articleTitle={article.title} articleUrl={`/article/${category}/${articleId}`} articleImageSrc={article.image} className='external-share'/>                
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
