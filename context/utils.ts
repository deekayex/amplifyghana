import { database } from "@/firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,limit,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { Firestore } from "firebase/firestore";

export function serializeFirebaseDocument(doc) {
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
export async function fetchHighlightedEditors(database:Firestore) {
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

export async function fetchEditorsData(database:Firestore) {
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

export async function handleToggleClick( articleId) {
  "use server";
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
    return updatedCenteredStates; // Instead of setCenteredStates
  } catch (error) {
    console.error("Error toggling centered state:", error);
    return {}; // Return empty object in case of error
  }
}

export async function fetchCenteredStates() {
  const centeredStatesCollection = collection(database, "centeredStates");
  const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

  const centeredStates = {};
  centeredStatesSnapshot.forEach((doc) => {
    centeredStates[doc.id] = doc.data().centeredState;
  });

  return centeredStates; // Instead of setCenteredStates
}

export async function handleSetHighlight(database, articleId) {
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

export const fetchHighlightedNews = async (database:Firestore) => {
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
export const fetchNewsData = async (database,page=1) => {
  try {
    const newsCollection = collection(database, "news");
    const newsQuery = query(newsCollection, orderBy("timestamp", "desc"),limit(6));
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