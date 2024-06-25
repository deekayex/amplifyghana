import React, { useEffect, useState } from "react";
import "./News.css";
import { database } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  orderBy,
  query,
  limit,
  startAfter,
} from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoadingArticles from "../../context/loading/ArticlesLoad/LoadingArticles";
import newspaper from "@/public/newspaper-folded.png";
import Image from "next/image";
import Link from "next/link";

const News = ({ isAllArticlesPage }) => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [highlightedArticleId, setHighlightedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [centeredStates, setCenteredStates] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const handleToggleClick = async (articleId) => {
    try {
      const articleDocRef = doc(database, "centeredStates", articleId);
      const articleDoc = await getDoc(articleDocRef);

      if (articleDoc.exists()) {
        const currentCenteredState = articleDoc.data().centeredState;
        const newCenteredState = !currentCenteredState;

        await updateDoc(articleDocRef, {
          centeredState: newCenteredState,
        });
      } else {
        await setDoc(articleDocRef, {
          centeredState: true,
        });
      }

      const updatedCenteredStates = await fetchCenteredStates();
      setCenteredStates(updatedCenteredStates);
    } catch (error) {
      console.error("Error toggling centered state:", error);
    }
  };

  const fetchCenteredStates = async () => {
    const centeredStatesCollection = collection(database, "centeredStates");
    const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

    const centeredStates = {};
    centeredStatesSnapshot.forEach((doc) => {
      centeredStates[doc.id] = doc.data().centeredState;
    });

    return centeredStates;
  };

  useEffect(() => {
    const initializeCenteredStates = async () => {
      const initialCenteredStates = await fetchCenteredStates();
      setCenteredStates(initialCenteredStates);
    };

    initializeCenteredStates();
  }, []);

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

  const fetchArticles = async (page = 1) => {
    try {
      setIsLoading(true);
      const newsCollection = collection(database, "news");
      const articlesQuery = query(newsCollection, orderBy("timestamp", "desc"), limit(articlesPerPage));

      let newsQuery = articlesQuery;
      if (page > 1 && lastVisible) {
        newsQuery = query(articlesQuery, startAfter(lastVisible));
      }

      const newsSnapshot = await getDocs(newsQuery);
      const articles = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastVisibleDoc = newsSnapshot.docs[newsSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      if (page === 1) {
        setNewsArticles(articles);
      } else {
        setNewsArticles((prevArticles) => {
          // Append only new articles that are not already in the list
          const newArticles = articles.filter(
            (article) => !prevArticles.some((prevArticle) => prevArticle.id === article.id)
          );
          return [...prevArticles, ...newArticles];
        });
      }
    } catch (error) {
      console.error("Error fetching news articles", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      fetchArticles(currentPage);
    }
  }, [currentPage]);

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [articlesPerRow, setArticlesPerRow] = useState(getArticlesPerRow());

  useEffect(() => {
    const handleResize = () => {
      setArticlesPerRow(getArticlesPerRow());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function getArticlesPerRow() {
    if (typeof window == "undefined") {
      return;
    }
    return window?.innerWidth >= 700 ? 3 : 2;
  }

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
        {isLoading ? (
          <LoadingArticles />
        ) : (
          <div className="page-contents">
            {Array.from({ length: articlesPerRow }).map((_, colIndex) => (
              <div key={colIndex} className="news-row">
                {newsArticles
                  .slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)
                  .filter(
                    (article, index) => index % articlesPerRow === colIndex
                  )
                  .map((article, rowIndex) => (
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
                          backgroundImage: `url(${
                            article ? article.image : ""
                          })`,
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
                          {user &&
                            isAllArticlesPage &&
                            !article.isHighlight && (
                              <button
                                onClick={() => handleToggleClick(article.id)}
                              >
                                Change Center
                              </button>
                            )}
                          {user &&
                            isAllArticlesPage &&
                            !article.isHighlight && (
                              <button
                                onClick={() => handleSetHighlight(article.id)}
                              >
                                Set as News Highlight
                              </button>
                            )}
                        </div>
                        <div className="content-text">
                          <h2 className="content-text-header">
                            {article.title}
                          </h2>
                          <p className="content-text-body">{article.summary}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        )}
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
          Page {currentPage} of {Math.ceil(newsArticles.length / articlesPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={newsArticles.length < currentPage * articlesPerPage}
          className="page-button"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default News;
