"use client";
import newspaper from "@/public/newspaper-folded.png";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter,
  getCountFromServer
} from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { database } from "../../firebase/firebase";
import "./News.css";
import LoadingHome from "@/context/loading/HomeLoad/LoadingHome";
import LoadingArticles from "@/context/loading/ArticlesLoad/LoadingArticles";

const News = ({ isAllArticlesPage,fetchNewsData, initialNewsArticles}) => {
  const [newsArticles, setNewsArticles] = useState(initialNewsArticles);
  const [user, setUser] = useState(null);
  const [, setHighlightedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [centeredStates, setCenteredStates] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    const initialize = async () => {
      try {
        // setIsLoading(true);
        const newsCollection = collection(database, "news");

        // const coll = collection(database, "news");
        const snapshot = await getCountFromServer(newsCollection);
        console.log('count: ', snapshot.data().count);
        
        // const totalArticlesQuery = await getDocs(newsCollection);
        const totalArticlesCount = snapshot.data().count;
        // console.log(totalArticlesCount);
        const totalPagesCount = Math.ceil(totalArticlesCount / articlesPerPage);
        setTotalPages(totalPagesCount);

        // const { articles, lastVisible } = await fetchArticles(1);
        // setNewsArticles(articles);
        // setLastVisible(lastVisible);

        setIsLoading(false);

        // Automatically load more articles if there are more pages
        if (totalPagesCount > 1) {
          // handleNextPage();
          fetchArticles(currentPage+1);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error initializing news articles", error);
      }
    };

    initialize();

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

  const fetchArticles = async (page = 1) => {
    try {
      // setIsLoading(true);
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

      const lastVisibleDoc = newsSnapshot.docs[newsSnapshot.docs.length - 1] || null;
      setLastVisible(lastVisibleDoc);

      if (page === 1) {
        // Always show at least the first 6 articles
        const initialArticles = articles.slice(0, articlesPerPage);
        setNewsArticles(initialArticles);
      } else {
        setNewsArticles((prevArticles) => {
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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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

  const fetchCenteredStates = async () => {
    const centeredStatesCollection = collection(database, "centeredStates");
    const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

    const centeredStates = {};
    centeredStatesSnapshot.forEach((doc) => {
      centeredStates[doc.id] = doc.data().centeredState;
    });

    return centeredStates;
  };

  const totalArticles = newsArticles.length;
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
  const currentArticles = newsArticles.slice(startIndex, endIndex);

  return (
    <Suspense fallback={<LoadingArticles/>}>
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
        <Suspense fallback={<LoadingArticles/>}>
          <div className="page-contents">
            {/* {isLoading ? (
              // <p>Loading...</p>
              <LoadingArticles/>
            ) : currentArticles.length === 0 ? (
              <p>Error Loading Articles Please reload.</p>
            ) : ( */}
             { currentArticles.map((article, rowIndex) => (
                <div key={rowIndex} className="news-row">
                  <Link
                    href={
                      user && isAllArticlesPage && !article.isHighlight
                        ? "#"
                        : `news/${article.id}`
                    }
                    key={rowIndex}
                    prefetch
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
                          <button onClick={() => handleDeleteArticles(article.id)}>
                            Delete
                          </button>
                        )}
                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleToggleClick(article.id)}>
                            Change Center
                          </button>
                        )}
                        {user && isAllArticlesPage && !article.isHighlight && (
                          <button onClick={() => handleSetHighlight(article.id)}>
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
            {/* )} */}
          </div>
        </Suspense>
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
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="page-button"
        >
          Next
        </button>
      </div>
    </section>
    </Suspense>
  );
};

export default News;
