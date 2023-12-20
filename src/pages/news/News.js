import React, { useEffect, useState } from 'react';
import './News.css';
import { database } from '../../firebase/firebase';
import { collection, getDocs } from '@firebase/firestore';


const News =() =>{
  const[newsArticles, setNewsArticles] = useState([]);
  // const newsArticles = [

  //   {
  //     title: 'BRA KOJO PERFORMS AT 9 OVER 9 OKENNETH CONCERT',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/brakojo.png',
  //   },
  //   {
  //     title: 'CONCRETE ROSES: THE CLAN\'S NEW EP IS AVAILABLE NOW',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/concreteroses.png',
  //   },
  //   {
  //     title: 'KIN EMSON DEBUTS WITH A SINGLE ABOUT LOVE \'JOLE\'',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/kinemson.png',
  //   },
  //   {
  //     title: 'KWAME DABIE TALKS ROADMAN TALES ON ‘DEMON SMILING’',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/kwamedabie.png',
  //   },
  //   {
  //     title: 'REBBEL ASHES TALKS BODY POSITIVITY ON NEW SINGLE',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/rebbelashes.png',
  //   },
  //   {
  //     title: '‘CERTIFIED LONER BOY’ AMOS K RELEASES NEW SONG',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/certifiedlonerboy.png',
  //   },
  //   {
  //     title: '‘CERTIFIED LONER BOY’ AMOS K RELEASES NEW SONG',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/certifiedlonerboy.png',
  //   },
  //   {
  //     title: '‘CERTIFIED LONER BOY’ AMOS K RELEASES NEW SONG',
  //     content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
  //     image: process.env.PUBLIC_URL + '/certifiedlonerboy.png',
  //   },
  //   // Add more news articles as needed...
  // ];

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const newsCollection = collection(database, 'news');
        const newsSnapshot = await getDocs(newsCollection);
        const articles = newsSnapshot.docs.map(doc => doc.data());
        setNewsArticles(articles);
      } catch (error) {
        console.error('Error fetching news articles', error);
      }
    };

    fetchData();
  }, []);


  const articlesPerPage = 6;

  const totalArticles = newsArticles.length;

  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerRow, setArticlesPerRow] = useState(getArticlesPerRow());


  useEffect(()=>{
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
      <div className='flex-contents'>
      <div className='page-contents'>

      {Array.from({ length: Math.ceil(currentArticles.length / articlesPerRow) }).map((_, rowIndex) => (
  <div key={rowIndex} className="news-row">
    {currentArticles.slice(rowIndex * articlesPerRow, (rowIndex + 1) * articlesPerRow).map((article, colIndex) => (
      <div key={colIndex} className="content-card">

                <img src={article.image} alt={article.title} className='content-pic' />
                <div className='content-text'>
                  <p className='content-text-header'>{article.title}</p>
                  <p className='content-text-body'>{article.content}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      </div>
      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className='page-button'>
          Back
        </button>
        <span className='page-number'>Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalArticles / articlesPerPage)} className='page-button'>
          Next
        </button>
      </div>
      
    </section>
  );
  
}

export default News;
