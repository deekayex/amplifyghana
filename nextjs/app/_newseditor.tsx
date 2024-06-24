import EditorsPicks from "@/components/editors-picks/page";
import News from "@/components/news/News";
import LoadingHome from "@/context/loading/HomeLoad/LoadingHome";
import React, { Suspense } from "react";
import { database, storage } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  orderBy,
  query,
  updateDoc,
} from "@firebase/firestore";
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
        return articleDoc.data(); // Instead of setHighlightedEditors
      }
    }
  } catch (error) {
    console.error("Error fetching highlighted article", error);
  }
  return null; // Return null if no data is fetched or in case of error
}

async function fetchData(database) {
  try {
    const editorsCollection = collection(database, "editors-picks");
    const editorsQuery = query(editorsCollection, orderBy("timestamp", "desc"));
    const editorsSnapshot = await getDocs(editorsQuery);
    const articles = editorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return articles; // Instead of setEditorsArticles
  } catch (error) {
    console.error("Error fetching news articles", error);
    return []; // Return empty array in case of error
  }
}

async function handleToggleClick(database, articleId) {
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
    const updatedCenteredStates = await fetchCenteredStates(database);
    return updatedCenteredStates; // Instead of setCenteredStates
  } catch (error) {
    console.error("Error toggling centered state:", error);
    return {}; // Return empty object in case of error
  }
}

async function fetchCenteredStates(database) {
  const centeredStatesCollection = collection(database, "centeredStates");
  const centeredStatesSnapshot = await getDocs(centeredStatesCollection);

  const centeredStates = {};
  centeredStatesSnapshot.forEach((doc) => {
    centeredStates[doc.id] = doc.data().centeredState;
  });

  return centeredStates; // Instead of setCenteredStates
}

async function handleSetHighlight(database, articleId) {
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
export default function NewsEditor() {
  return (
    <>
      <Suspense fallback={<LoadingHome />}>
        <News isAllArticlesPage={false} />
      </Suspense>
      <Suspense fallback={<LoadingHome />}>
        <EditorsPicks isAllArticlesPage={false} />
      </Suspense>
    </>
  );
}
