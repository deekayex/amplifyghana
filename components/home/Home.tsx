import { database } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";
import Link from "next/link";
// import LoadingHome from "../../context/loading/HomeLoad/LoadingHome";
import FeaturedAd from "../FeaturedAd";
import "./Home.css";
// import { fetchDataWithCache } from "@/context/cache/cacheUtils";
import Image from "next/image";

// Simple in-memory cache with maxAge support (in seconds)
const cache = new Map();
async function fetchDataWithCache(key, fetchFn, maxAge = 60) {
  const cached = cache.get(key);
  const now = Date.now();
  if (cached && now - cached.timestamp < maxAge * 1000) {
    return cached.data;
  }
  const data = await fetchFn();
  cache.set(key, { data, timestamp: now });
  return data;
}


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
async function Home() {

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

  const editorsLink = highlightedEditors
    ? `editors-picks/${highlightedEditors.id}`
    : "";
  const newsLink = highlightedNews ? `news/${highlightedNews.id}` : "";

  return (
    <div className="homepage-components">
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
      {/* {loading && <LoadingHome />} */}
      <div className="homepage-contents">
        {highlightedEditors && (
          <div
            className="left-homepage"
            aria-label="link-to-featured-editors-pick"
            style={{
              backgroundImage: `url(${highlightedEditors.image || ""})`,
            }}
          >
            <Link
              href={editorsLink}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              prefetch
            />
            <div className="editor">
              <Link
                href="#/editors-pick"
                aria-label="link-to-editors-page"
                className="sticker"
              >
                <h3>EDITOR'S PICKS</h3>
              </Link>
            </div>
            <Link href={editorsLink} prefetch>
              <div className="editor-text">
                <h2 className="editor-text-header">
                  {highlightedEditors.title || "Loading..."}
                </h2>
                <p className="editor-text-body">{highlightedEditors.summary}</p>
              </div>
            </Link>
          </div>
        )}
        <div className="right-homepage">
          {highlightedNews && (
            <div
              className="news-component"
              aria-label="link-to-featured-news"
              style={{
                backgroundImage: `url(${highlightedNews.image || ""})`,
              }}
            >
              <Link
                href={newsLink}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
                prefetch
              />
              <div className="editor">
                <Link
                  href="#news"
                  aria-label="link-to-news-page"
                  className="sticker"
                >
                  <h3>NEWS</h3>
                </Link>
              </div>

              <Link href={newsLink} prefetch>
                <div className="news-text">
                  <h2 className="news-text-header">
                    {highlightedNews.title || "Loading..."}
                  </h2>
                  <p className="news-text-body">
                    {highlightedNews.summary || ""}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {highlightedPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-component">
              <div
                // href={playlist.link}
                // target="_blank"
                // rel="noopener noreferrer"
                aria-label="link-to-featured-playlist"
              >
                <div className="playlist-text">
                  <Link
                    href="/playlists"
                    className="sticker"
                    aria-label="link-to-playlists-page"
                  >
                    <h3>PLAYLISTS</h3>
                  </Link>
                </div>
                {/* <button
                  className="playlist-button"
                  onClick={() => window.open(playlist.link, "_blank")}
                  // make the onclick a link instead
                >
                  Listen
                </button> */}
                <Link
                  href={playlist.link}
                  target="_blank"
                >
                  <div className="playlist-button">
                    Listen
                  </div>
                  
                <Image
                  src={playlist.imageUrl}
                  alt={playlist.title}
                  className="highlighted-playlist-image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  priority
                />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-homepage">
        {newFeaturedAd.map((ad) => (
          <FeaturedAd key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}

export default Home;
