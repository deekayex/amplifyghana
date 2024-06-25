"use client";
import newspaper from "@/public/newspaper-folded.png";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import "./News.css";

const News = ({
  isAllArticlesPage,
  newsArticles,
  centeredStates,
  handleToggleClick,
  highlightedArticleId,
}) => {
  const [, setNewsArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [, setHighlightedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [centeredStates, setCenteredStates] = useState({});

  // const handleToggleClick = async (articleId) => {
  //   try {
  //     console.log(articleId, "articleId now");
  //     const articleDocRef = doc(database, "centeredStates", articleId);
  //     console.log(articleDocRef);
  //     const articleDoc = await getDoc(articleDocRef);

  //     if (articleDoc.exists()) {
  //       // If the document exists, update the centered state
  //       const currentCenteredState = articleDoc.data().centeredState;
  //       const newCenteredState = !currentCenteredState;

  //       await updateDoc(articleDocRef, {
  //         centeredState: newCenteredState,
  //       });
  //     } else {
  //       // If the document doesn't exist, create a new one
  //       await setDoc(articleDocRef, {
  //         centeredState: true, // Initial state
  //       });
  //     }

  //     // Fetch the updated centered states
  //     const updatedCenteredStates = await fetchCenteredStates();
  //     setCenteredStates(updatedCenteredStates);
  //   } catch (error) {
  //     console.error("Error toggling centered state:", error);
  //   }
  // };

  const fetchCenteredStates = async () => {
    const centeredStatesCollection = collection(database, "centeredStates");
    const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

    const centeredStates = {};
    centeredStatesSnapshot.forEach((doc) => {
      centeredStates[doc.id] = doc.data().centeredState;
    });

    return centeredStates;
  };

  // Call fetchCenteredStates once to initialize the state
  // useEffect(() => {
  //   const initializeCenteredStates = async () => {
  //     const initialCenteredStates = await fetchCenteredStates();
  //     setCenteredStates(initialCenteredStates);
  //   };

  //   initializeCenteredStates();
  // }, []);

  const handleSetHighlight = async (articleId) => {
    try {
      await setDoc(doc(database, "highlighted", "highlightedNews"), {
        articleId,
      });

      setHighlightedArticleId(articleId);
      alert("Article set as highlight successfully!");
    } catch (error) {
      console.error("Error setting highlight:", error);
    }
  };

  useEffect(() => {
    // const fetchHighlightedNews = async () => {
    //   try {
    //     const highlightedArticleDoc = await getDoc(
    //       doc(database, "highlighted", "highlightedNews")
    //     );
    //     const highlightedArticleData = highlightedArticleDoc.data();

    //     if (highlightedArticleData) {
    //       setHighlightedArticleId(highlightedArticleData.articleId);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching highlighted article", error);
    //   }
    // };
    // const fetchData = async () => {
    //   try {
    //     // const highlightedArticleDoc = await getDoc(
    //     //   doc(database, "highlighted", "highlightedNews")
    //     // );
    //     // const highlightedArticleData = highlightedArticleDoc.data();

    //     // if (highlightedArticleData) {
    //     //   setHighlightedArticleId(highlightedArticleData.articleId);
    //     // }

    //     // Fetch all news articles
    //     const newsCollection = collection(database, "news");
    //     const newsQuery = query(newsCollection, orderBy("timestamp", "desc"));
    //     const newsSnapshot = await getDocs(newsQuery);
    //     const articles = newsSnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setNewsArticles(articles);
    //   } catch (error) {
    //     console.error("Error fetching news articles", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchHighlightedNews();
    // fetchData();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteArticles = async (id) => {
    if (isAllArticlesPage) {
      const newsDoc = doc(database, "news", id);
      await deleteDoc(newsDoc);
      setNewsArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== id)
      );
    } else {
      alert("You are not allowed to delete any article here");
    }
  };

  const articlesPerPage = 6;
  const totalArticles = newsArticles.length;
  const [currentPage, setCurrentPage] = useState(1);
  // const [articlesPerRow, setArticlesPerRow] = useState(getArticlesPerRow());

  // useEffect(() => {
  //   const handleResize = () => {
  //     setArticlesPerRow(getArticlesPerRow());
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
  const currentArticles = newsArticles.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(totalArticles / articlesPerPage))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // function getArticlesPerRow() {
  //   if (typeof window == "undefined") {
  //     return;
  //   }
  //   return window?.innerWidth >= 700 ? 3 : 2;
  // }

  return (
    <section className="news-container" id="news">
      <div className="spacer" />
      <div className="page-header">
        <Image
          src={newspaper}
          alt="News icon"
          className="news-icon"
          width={10}
          height={10}
        />
        <h1>NEWS</h1>
      </div>

      <div className="flex-contents">
        {/* {isLoading ? (
          <LoadingArticles />
        ) : ( */}
        <Suspense>
          <div className="page-contents">
            {/* {Array.from({ length: articlesPerRow }).map((_, colIndex) => ( */}
            {currentArticles
              // .filter(
              //   (article, index) => index % articlesPerRow === colIndex
              // )
              .map((article, rowIndex) => (
                <div key={rowIndex} className="news-row">
                  <Link
                    href={
                      user && isAllArticlesPage && !article.isHighlight
                        ? "#"
                        : `/article/news/${article.id}`
                    }
                    key={rowIndex}
                  >
                    <div
                      className={`content-card ${
                        centeredStates[article.id] ? "centered" : ""
                      } `}
                      style={{
                        backgroundImage: `url(${article ? article.image : ""})`,
                      }}
                    >
                      <div className="card-manager">
                        {user && isAllArticlesPage && (
                          <button
                            onClick={() => handleDeleteArticles(article.id)}
                          >
                            Delete
                          </button>
                        )}
                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleToggleClick(article.id)}>
                            Change Center
                          </button>
                        )}
                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button
                            onClick={() => handleSetHighlight(article.id)}
                          >
                            Set as News Highlight
                          </button>
                        )}
                      </div>
                      <div className="content-text">
                        <h2 className="content-text-header">{article.title}</h2>
                        <p className="content-text-body">{article.summary}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            {/* // ))} */}
          </div>
        </Suspense>
        {/* )} */}
      </div>
      <div className="pagination">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="page-button"
        >
          Back
        </button>
        <span className="page-number">
          Page {currentPage} of {Math.ceil(totalArticles / articlesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(totalArticles / articlesPerPage)}
          className="page-button"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default News;
