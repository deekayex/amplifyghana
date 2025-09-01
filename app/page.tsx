import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import Home from "@/components/home/Home";
import { fetchDataWithCache } from "@/context/cache/cacheUtils";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import Socials from "../components/socials/Socials";
import "./HomePages.css";
import NewsEditor from "./_newseditor";

async function fetchHighlightedNews(database) {
  const highlightedNewsDoc = await fetchDataWithCache(
    "highlightedNewsCache",
    () => getDoc(doc(database, "highlighted", "highlightedNews"))
  );
  if (highlightedNewsDoc.exists()) {
    const articleRef = doc(
      database,
      "news",
      highlightedNewsDoc.data().articleId
    );
    const articleDoc = await getDoc(articleRef);
    if (articleDoc.exists()) {
      return {
        id: articleDoc.id,
        // ...articleDoc.data(),
        ...serializeFirebaseDocument(articleDoc),
      };
    }
  }
  return null; // Return null if no data is found
}

// Fetch highlighted editors
async function fetchHighlightedEditors(database) {
  const highlightedEditorsDoc = await fetchDataWithCache(
    "highlightedEditorsCache",
    () => getDoc(doc(database, "highlighted", "highlightedEditors"))
  );
  if (highlightedEditorsDoc.exists()) {
    const articleRef = doc(
      database,
      "editors-picks",
      highlightedEditorsDoc.data().articleId
    );
    const articleDoc = await getDoc(articleRef);
    if (articleDoc.exists()) {
      return {
        id: articleDoc.id,
        // ...articleDoc.data(),
        ...serializeFirebaseDocument(articleDoc),
      };
    }
  }
  return null; // Return null if no data is found
}

// Fetch highlighted playlists
async function fetchHighlightedPlaylists(database) {
  const playlistsSnapshot = await fetchDataWithCache("playlistsCache", () =>
    getDocs(collection(database, "Playlisthighlights"))
  );

  return playlistsSnapshot.docs.map((doc) => ({
    id: doc.id,
    // ...doc.data(),
    ...serializeFirebaseDocument(doc),
  }));
}
// Function to serialize Firebase document data
function serializeFirebaseDocument(doc) {
  // Assuming doc is a document fetched from Firestore
  const data = doc.data();

  // Serialize the Timestamp field
  const serializedTimestamp = data.timestamp
    ? {
        seconds: data.timestamp.seconds,
        nanoseconds: data.timestamp.nanoseconds,
        isoString: data.timestamp.toDate().toISOString(),
        // Milliseconds example:
        milliseconds: data.timestamp.toMillis(),
      }
    : null;

  // Return a new object with all data serialized
  return {
    ...data,
    timestamp: serializedTimestamp,
  };
}
// Fetch featured ads
async function fetchFeaturedAd(database) {
  const featuredAdSnapshot = await fetchDataWithCache("featuredAdCache", () =>
    getDocs(collection(database, "FeaturedAd"))
  );
  return featuredAdSnapshot.docs.map((doc) => ({
    id: doc.id,
    // ...doc.data(),
    ...serializeFirebaseDocument(doc),
  }));
}
async function HomePages() {
  return (
    <div className="container" id="home">
      <div className="home-contain">
        <div className="home-page">
          <div className="space" />
          <div className="home-menu-icons">
            <div className="home-icon">
              <HomeOutlinedIcon fontSize="large" className="home_icon" />
              HOME
            </div>
            <div className="home-socials">
              <Socials />
            </div>
          </div>
            <Home/>
          <NewsEditor />
        </div>
      </div>
    </div>
  );
}

export default HomePages;
