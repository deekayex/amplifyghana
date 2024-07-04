import EditorsPicks from "@/components/editors-picks/page";
import News from "@/components/news/News";
import LoadingArticles from "@/context/loading/ArticlesLoad/LoadingArticles";
import LoadingHome from "@/context/loading/HomeLoad/LoadingHome";
import { database } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,count,
  limit,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { Suspense } from "react";
function serializeFirebaseDocument(doc) {
  // Assuming doc is a document fetched from Firestore
  const data = doc.data();

  // Serialize the Timestamp field
  const serializedTimestamp = data.timestamp
    ? {
        seconds: data.timestamp.seconds,
        nanoseconds: data.timestamp.nanoseconds,
        // Optionally convert to ISO string or milliseconds for easier handling on the client side
        // ISO string example:
        isoString: data.timestamp.toDate().toISOString(),
        // Milliseconds example:
        milliseconds: data.timestamp.toMillis(),
      }
    : null;

  // Return a new object with all data serialized
  return {
    ...data,
    // Replace the original timestamp with the serialized version
    timestamp: serializedTimestamp,
    // Ensure any other complex types are also serialized
  };
}
async function fetchHighlightedEditors(database) {
  try {
    const highlightedEditorsDoc = await getDoc(
      doc(database, "highlighted", "highlightedEditors")
    );
    const highlightedEditorsData = highlightedEditorsDoc.data();

    if (highlightedEditorsData) {
      const articleRef = doc(
        database,
        "editors-picks",
        highlightedEditorsData.articleId
      );
      const articleDoc = await getDoc(articleRef);

      if (articleDoc.exists()) {
        return serializeFirebaseDocument(articleDoc); // Instead of setHighlightedEditors
      }
    }
  } catch (error) {
    console.error("Error fetching highlighted article", error);
  }
  return null; // Return null if no data is fetched or in case of error
}

async function fetchEditorsData(database) {
  try {
    const editorsCollection = collection(database, "editors-picks");
    const editorsQuery = query(editorsCollection, orderBy("timestamp", "desc"));
    const editorsSnapshot = await getDocs(editorsQuery);
    const articles = editorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      // ...doc.data(),
      ...serializeFirebaseDocument(doc),
    }));
    return articles; // Instead of setEditorsArticles
  } catch (error) {
    console.error("Error fetching news articles", error);
    return []; // Return empty array in case of error
  }
}

async function handleToggleClick(database, articleId) {
  "use server";
  try {
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
    return updatedCenteredStates; // Instead of setCenteredStates
  } catch (error) {
    console.error("Error toggling centered state:", error);
    return {}; // Return empty object in case of error
  }
}

async function fetchCenteredStates() {
  const centeredStatesCollection = collection(database, "centeredStates");
  const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

  const centeredStates = {};
  centeredStatesSnapshot.forEach((doc) => {
    centeredStates[doc.id] = doc.data().centeredState;
  });

  return centeredStates; // Instead of setCenteredStates
}

async function handleSetHighlight(articleId) {
  "use server";
  try {
    await setDoc(doc(database, "highlighted", "highlightedEditors"), {
      articleId,
    });

    return articleId; // Instead of setHighlightedArticleId
  } catch (error) {
    console.error("Error setting highlight:", error);
    return null; // Return null in case of error
  }
}

export const fetchHighlightedNews = async () => {
  try {
    const highlightedArticleDoc = await getDoc(
      doc(database, "highlighted", "highlightedNews")
    );
    const highlightedArticleData = highlightedArticleDoc.data();

    if (highlightedArticleData) {
      return highlightedArticleData.articleId;
    }
  } catch (error) {
    console.error("Error fetching highlighted article", error);
    return null;
  }
};

// Function to fetch all news articles
export const fetchNewsData = async (database, page = 1) => {
  "use server";
  try {
    const articlesPerPage = 6;
    const newsCollection = collection(database, "news");
    // const totalArticlesQuery = await getDocs(newsCollection);
    // const totalArticlesCount = totalArticlesQuery.size;
    // const totalPagesCount = Math.ceil(totalArticlesCount / articlesPerPage);
    const newsQuery = query(
      newsCollection,
      orderBy("timestamp", "desc"),
      limit(articlesPerPage)
    );
    const newsSnapshot = await getDocs(newsQuery);
    const articles = newsSnapshot.docs.map((doc) => ({
      id: doc.id,
      // ...doc.data(),
      ...serializeFirebaseDocument(doc),
    }));
    return articles;
  } catch (error) {
    console.error("Error fetching news articles", error);
    return [];
  }
};
export default async function NewsEditor() {
  //write the equivalent of that for the EditorsPicks
  const highlightedEditors = await fetchHighlightedEditors(database);
  const editorsData = await fetchEditorsData(database);
  const centeredStates = await fetchCenteredStates();

  const newsArticles = await fetchNewsData(database);
  // const highlightedArticleId = await fetchHighlightedNews(database);
  return (
    <>
      <Suspense fallback={<LoadingArticles />}>
        <News
          isAllArticlesPage={false}
          // handleToggleClick={handleToggleClick}
          fetchNewsData={fetchNewsData}
          initialNewsArticles={newsArticles}
          // totalPagesCount={totalPagesCount}
          // highlightedArticleId={highlightedArticleId}
          // centeredStates={centeredStates}
        />
      </Suspense>
      <Suspense fallback={<LoadingArticles />}>
        <EditorsPicks
          isAllArticlesPage={false}
          highlightedEditors={highlightedEditors}
          editorsArticles={editorsData}
          // handleToggleClick={handleToggleClick}
          // centeredStates={centeredStates}
          // handleSetHighlight={handleSetHighlight}
        />
      </Suspense>
    </>
  );
}
