import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Suspense } from "react";
import Home from "../components/Home";
import EditorsPicks from "../components/editors-picks/page";
import News from "../components/news/News";
import Socials from "../components/socials/Socials";
import { fetchDataWithCache } from "../context/cache/cacheUtils";
import LoadingHome from "../context/loading/HomeLoad/LoadingHome";
import "./HomePages.css";
import { database } from "@/firebase/firebase";
import NewsEditor from "./_newseditor";

// const News = dynamic(() => import("../components/news/News"));
// const EditorsPicks = dynamic(() => import("../components/editors-picks/page"));

// export const metadata: Metadata = {
//   title:
//     "Amplify Ghana | Promoting African Creatives | PR Agency | Music and\
//   Entertainment News",
//   description:
//     "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered.",
//   openGraph: {
//     images:
//       "https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png",
//   },
// };
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
  const [
    highlightedNews,
    highlightedEditors,
    highlightedPlaylists,
    newFeaturedAd,
  ] = await Promise.all([
    fetchHighlightedNews(database),
    fetchHighlightedEditors(database),
    fetchHighlightedPlaylists(database),
    fetchFeaturedAd(database),
  ]);

  return (
    <div className="container" id="home">
      {/* <Helmet>
        <title>
          Amplify Ghana | Promoting African Creatives | PR Agency | Music and
          Entertainment News
        </title>
        <meta
          name="description"
          content="Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered."
        />
        <meta
          property="og:image"
          content="https://ucarecdn.com/04cd01ca-f483-421d-acad-b64ab26cd7f1/sharelogo.png"
        />
      </Helmet> */}
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
          <Suspense fallback={<LoadingHome />}>
            <Home
              highlightedNews={highlightedNews}
              highlightedEditors={highlightedEditors}
              highlightedPlaylists={highlightedPlaylists}
              newFeaturedAd={newFeaturedAd}
            />
          </Suspense>
          {/* <Suspense fallback={<LoadingHome />}>
            <News isAllArticlesPage={false} />
          </Suspense>
          <Suspense fallback={<LoadingHome />}>
            <EditorsPicks isAllArticlesPage={false} />
          </Suspense> */}
          <NewsEditor />
        </div>
      </div>
    </div>
  );
}

export default HomePages;
