// app/home/page.js or wherever your HomePages component lives

export const revalidate = 10; // Regenerate page every 10 seconds

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Home from "@/components/home/Home";
import NewsEditor from "./_newseditor";
import Socials from "../components/socials/Socials";
import { database } from "@/firebase/firebase";
import { fetchDataWithCache } from "@/context/cache/cacheUtils";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import "./HomePages.css";

// --- Firestore fetchers ---
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
      return { id: articleDoc.id, ...serializeFirebaseDocument(articleDoc) };
    }
  }
  return null;
}

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
      return { id: articleDoc.id, ...serializeFirebaseDocument(articleDoc) };
    }
  }
  return null;
}

async function fetchHighlightedPlaylists(database) {
  const playlistsSnapshot = await fetchDataWithCache("playlistsCache", () =>
    getDocs(collection(database, "Playlisthighlights"))
  );

  return playlistsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeFirebaseDocument(doc),
  }));
}

async function fetchFeaturedAd(database) {
  const featuredAdSnapshot = await fetchDataWithCache("featuredAdCache", () =>
    getDocs(collection(database, "FeaturedAd"))
  );

  return featuredAdSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeFirebaseDocument(doc),
  }));
}

// --- Serializer ---
function serializeFirebaseDocument(doc) {
  const data = doc.data();
  return {
    ...data,
    timestamp: data.timestamp
      ? {
          seconds: data.timestamp.seconds,
          nanoseconds: data.timestamp.nanoseconds,
          isoString: data.timestamp.toDate().toISOString(),
          milliseconds: data.timestamp.toMillis(),
        }
      : null,
  };
}

// --- Page Component ---
export default async function HomePages() {
  const [highlightedNews, highlightedEditors, playlists, featuredAd] = await Promise.all([
    fetchHighlightedNews(database),
    fetchHighlightedEditors(database),
    fetchHighlightedPlaylists(database),
    fetchFeaturedAd(database),
  ]);

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

          <Home
            highlightedNews={highlightedNews}
            highlightedEditors={highlightedEditors}
            playlists={playlists}
            featuredAd={featuredAd}
          />
          <NewsEditor highlightedEditors={highlightedEditors} />
        </div>
      </div>
    </div>
  );
}
