"use client";
import newspaper from "/public/newspaper-folded.png";
import { collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, startAfter, updateDoc } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import LoadingArticles from "../../context/loading/ArticlesLoad/LoadingArticles";
import { database } from "../../firebase/firebase";

function EditorsPicks({ isAllArticlesPage, highlightedEditors, totalPagesCount, editorsArticles = [] }) {
  const [, setEditorsArticles] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setHighlightedArticleId] = useState(null);
  const [centeredStates, setCenteredStates] = useState({});
   const [lastVisible, setLastVisible] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(totalPagesCount || 1);
    const [fetchedPages, setFetchedPages] = useState(new Set());
    const [fetchError, setFetchError] = useState(null);
    const articlesPerPage = 6;

   const fetchArticles = useCallback(
     async (page = 1) => {
       if (fetchedPages.has(page)) return; // Skip if already fetched
 
       setIsLoading(true);
       setFetchError(null);
 
       console.log(`Fetching data for page: ${page}`);
 
       try {
         const editorsCollection = collection(database, "editors-picks");
         const articlesQuery = query(
           editorsCollection,
           orderBy("timestamp", "desc"),
           limit(articlesPerPage)
         );
         let editorsQuery = articlesQuery;
         if (page > 1 && lastVisible[page - 1]) {
           editorsQuery = query(
             editorsQuery,
             startAfter(lastVisible[page - 1])
           );
         }
 
         const editorsSnapshot = await getDocs(editorsQuery);
         const articles = editorsSnapshot.docs.map((doc) => ({
           id: doc.id,
           ...doc.data(),
         }));
 
         const lastVisibleDoc =
           editorsSnapshot.docs[editorsSnapshot.docs.length - 1] || null;
         setLastVisible(lastVisibleDoc);
 
         setLastVisible((prevMap) => ({
           ...prevMap,
           [page]: lastVisibleDoc,
         }));
 
         setEditorsArticles((prevArticles) => {
           const newArticles = articles.filter(
             (article) =>
               !prevArticles.some((prevArticle) => prevArticle.id === article.id)
           );
           return [...prevArticles, ...newArticles];
         });
 
         setFetchedPages((prevSet) => new Set(prevSet).add(page));
       } catch (error) {
         console.error("Error fetching articles:", error);
         setFetchError("Failed to fetch articles. Please try again.");
 
         setFetchedPages((prevSet) => {
           const updatedSet = new Set(prevSet);
           updatedSet.delete(page);
           return updatedSet;
         });
 
       } finally {
         setIsLoading(false);
       }
     },
     [fetchedPages, lastVisible]
   );
 
   useEffect(() => {
     const initialize = async () => {
       const editorsCollection = collection(database, "editors-picks");
       const countSnapshot = await getCountFromServer(editorsCollection);
       const totalArticles = countSnapshot.data().count;
       setTotalPages(Math.ceil(totalArticles / articlesPerPage));
 
       fetchArticles(1);
     };
 
     initialize();
   }, [fetchArticles]);
 
   useEffect(() => {
     const auth = getAuth();
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       setUser(user);
     });
 
     // Fetch articles for the current page
     fetchArticles(currentPage);
 
     return () => {
       unsubscribe();
     };
   }, [currentPage, fetchArticles]);
 
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
         setEditorsArticles((prevArticles) =>
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
         await setDoc(doc(database, "highlighted", "highlightedEditors"), {
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
   
     const totalArticles = editorsArticles.length;
     const startIndex = (currentPage - 1) * articlesPerPage;
     const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);
     const currentArticles = editorsArticles.slice(startIndex, endIndex);
   
  return (
    <>
    <div className="page-header">
      <Image
        src= '/newspaper-folded.png'
        alt="Editors icon"
        className="news-icon"
        width={10}
        height={10}
        unoptimized
        priority
      />
      <h1>Editor's Picks</h1>
    </div>

    <div className="flex-contents">
    
        <div className="page-contents">
        {isLoading && <LoadingArticles />} 
        {!isLoading &&               
          currentArticles.map((article, rowIndex) => (
            <div key={rowIndex} className="news-row">
              <Link
                href={
                  user && isAllArticlesPage && !article.isHighlight
                    ? "#"
                    : `editors-picks/${article.id}`
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
                        Set as Editors Highlight
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

    </>
  );
}

export default EditorsPicks;
