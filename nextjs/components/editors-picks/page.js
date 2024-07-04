"use client";
import newspaper from "@/public/newspaper-folded.png";
import { collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter, } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Authentication functions
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingArticles from "../../context/loading/ArticlesLoad/LoadingArticles";
import { database } from "../../firebase/firebase";

function EditorsPicks({
  isAllArticlesPage,
  highlightedEditors,
  editorsArticles= [],
  // handleToggleClick,
  // centeredStates,
  // handleSetHighlight,
}) {
  const [, setEditorsArticles] = useState([]);
  const [user, setUser] = useState(null); // State to track the authenticated user
  const [isLoading, setIsLoading] = useState(false);
  const [, setHighlightedArticleId] = useState(null);
  // const [, setHighlightedEditors] = useState(null);
  const [centeredStates, setCenteredStates] = useState({});

  const handleToggleClick = async (articleId) => {
    try {
      console.log("clicked",articleId);
      const articleDocRef = doc(database, "centeredStates", articleId);
      const articleDoc = await getDoc(articleDocRef);

      if (articleDoc.exists()) {
        // If the document exists, update the centered state
        const currentCenteredState = articleDoc.data().centeredState;
        const newCenteredState = !currentCenteredState;

        await updateDoc(articleDocRef, {
          centeredState: newCenteredState,
        });
      } else {
        // If the document doesn't exist, create a new one
        await setDoc(articleDocRef, {
          centeredState: true, // Initial state
        });
      }

      // Fetch the updated centered states
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
      await setDoc(doc(database, "highlighted", "highlightedEditors"), {
        articleId,
      });

      setHighlightedArticleId(articleId);
      alert("Article set as highlight successfully!");
    } catch (error) {
      console.error("Error setting highlight:", error);
    }
  };

  useEffect(() => {
    // const fetchHighlightedEditors = async () => {
    //   try {
    //     const highlightedEditorsDoc = await getDoc(
    //       doc(database, "highlighted", "highlightedEditors")
    //     );
    //     const highlightedEditorsData = highlightedEditorsDoc.data();

    //     if (highlightedEditorsData) {
    //       const articleRef = doc(
    //         database,
    //         "editors-picks",
    //         highlightedEditorsData.articleId
    //       );
    //       const articleDoc = await getDoc(articleRef);

    //       if (articleDoc.exists()) {
    //         setHighlightedEditors(articleDoc.data());
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Error fetching highlighted article", error);
    //   }
    // };

    // const fetchData = async () => {
    //   try {
    //     const editorsCollection = collection(database, "editors-picks");
    //     const editorsQuery = query(
    //       editorsCollection,
    //       orderBy("timestamp", "desc")
    //     );
    //     const editorsSnapshot = await getDocs(editorsQuery);
    //     const articles = editorsSnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     setEditorsArticles(articles);
    //   } catch (error) {
    //     console.error("Error fetching news articles", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // fetchHighlightedEditors();
    // fetchData();

    // Add listener for authentication state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the subscription to avoid memory leaks
    return () => unsubscribe();
  }, []);

  const handleDeleteArticles = async (id) => {
    const newsDoc = doc(database, "editors-picks", id);
    await deleteDoc(newsDoc);

    setEditorsArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

  const articlesPerPage = 6;

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
  //   } //hydration issues
  //   return window.innerWidth >= 700 ? 3 : 2;
  // }
  const totalArticles = editorsArticles.length;
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
  const currentArticles = editorsArticles.slice(startIndex, endIndex);

  return (
    <section className="editor-page" id="editors-pick">
      <div className="editor_space" />
      <div className="page-header">
        <Image
          src={newspaper}
          alt="News icon"
          className="news-icon"
          width={10}
          height={10}
        />
        <h1>Editor's Picks</h1>
      </div>

      <div className="flex-contents">
        {isLoading ? (
          <LoadingArticles />
        ) : (
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
                        : `article/editors-picks/${article.id}`
                    }
                    key={`col--row-${rowIndex}`}
                  >
                    <div
                      key={`col--row-${rowIndex}`}
                      className={`content-card ${
                        centeredStates[article.id] ? "centered" : ""
                      }`}
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

                        {!article.isHighlight && isAllArticlesPage && (
                          <button
                            onClick={() => handleSetHighlight(article.id)}
                          >
                            Set as Editor's Highlight
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
        <span>
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
}

export default EditorsPicks;
