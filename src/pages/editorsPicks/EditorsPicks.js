import React, {useState, useEffect} from 'react'

function EditorsPicks() {
  const newsArticles = [
    {
      title: 'MUSIC COLLECTIVES IN GHANA, THE CREATIVES',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/brakojo.png',
    },
    {
      title: 'INTERVIEW : AYRA STARR, THE SABI GIRL',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/arya.png',
    },
    {
      title: 'REVIEW : LOOKING AT ROLLIES AND CIGARS IN RETROSPECT',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/review.png',
    },
    {
      title: 'STREETWEAR BRANDS THAT ARE MAKING WAVES IN GHANA',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/streetwear.png',
    },
    {
      title: 'ONE YEAR ON : KING PROMISE’S TERMINATOR REVIEW',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/oneyearon.png',
    },
    {
      title: 'INTERVIEW : LIFE SIZE TEDDY IS MAVIN RECORD’S NEW ARTISTE',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/interview.png',
    },
    {
      title: '‘CERTIFIED LONER BOY’ AMOS K RELEASES NEW SONG',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/arya.png',
    },
    {
      title: '‘CERTIFIED LONER BOY’ AMOS K RELEASES NEW SONG',
      content: 'BRO JUST GOT ON STAGE AND GAVE SOME WILD FREESTYLE AND ALL EVERYONE WAS HYPED AF AND JUST LIKE HIGH AND NIGGAS WAS IN PARIS AND BRO IDEK WHAT TO TYPE AT THIS POINT BUT YOU GET MY DRIFT INNIT NIGGAS WAS HYPED LIKE MAD HYPED',
      image: process.env.PUBLIC_URL + '/certifiedlonerboy.png',
    },
    // Add more news articles as needed...
  ];

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
    <section className='home-page' id='editors-pick'>
      <div className='space'/>
      <div className='page-header'>
        <img src={process.env.PUBLIC_URL + '/newspaper-folded.png'} alt='News icon' className='news-icon' />
      EditorsPicks
    </div>

  <div className='flex-contents'>
      <div className='page-contents'>
        {Array.from({ length: Math.ceil(currentArticles.length / articlesPerRow) }).map((_, rowIndex) => (
          <div key={rowIndex} className='news-row'>
            {currentArticles.slice(rowIndex * articlesPerRow, (rowIndex + 1) * articlesPerRow).map((article, colIndex) => (
              <div key={colIndex} className='content-card'>
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
        <span>Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(totalArticles / articlesPerPage)} className='page-button'>
          Next
        </button>
      </div>
      
    </section>
  );
  
}

export default EditorsPicks