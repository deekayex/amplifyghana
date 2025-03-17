"use client";
import { useState, useEffect } from "react";
import { database } from "@/firebase/firebase";
import FeaturedAd from "../FeaturedAd";
import "./Home.css";
import Link from "next/link";
import Image from "next/image";
import { fetchDataWithCache } from "@/context/cache/cacheUtils";
import { collection, doc, getDoc, getDocs } from "@firebase/firestore";

async function fetchHighlightedNews(database) {
  const highlightedNewsDoc = await fetchDataWithCache(
    "highlightedNewsCache",
    () => getDoc(doc(database, "highlighted", "highlightedNews"))
  );
  if (highlightedNewsDoc.exists()) {
    const articleRef = doc(database, "news", highlightedNewsDoc.data().articleId);
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
    const articleRef = doc(database, "editors-picks", highlightedEditorsDoc.data().articleId);
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

export default function HomeWrapper() {
  const [homeData, setHomeData] = useState({
    highlightedNews: null,
    highlightedEditors: null,
    highlightedPlaylists: [],
    newFeaturedAd: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const [highlightedNews, highlightedEditors, highlightedPlaylists, newFeaturedAd] =
        await Promise.all([
          fetchHighlightedNews(database),
          fetchHighlightedEditors(database),
          fetchHighlightedPlaylists(database),
          fetchFeaturedAd(database),
        ]);

      if (isMounted) {
        setHomeData({ highlightedNews, highlightedEditors, highlightedPlaylists, newFeaturedAd });
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return <Home {...homeData} />;
}

function Home({ highlightedNews, highlightedEditors, highlightedPlaylists = [], newFeaturedAd = [] }) {
  return (
    <div className="homepage-components">
      <div className="homepage-contents">
        {highlightedEditors && (
          <Link href={`editors-picks/${highlightedEditors.id}`} className="left-homepage"
            aria-label="link-to-featured-editors-pick"
            style={{ backgroundImage: `url(${highlightedEditors.image || ""})` }}
          >
            <div className="editor-text">
              <h2 className="editor-text-header">{highlightedEditors.title || ""}</h2>
              <p className="editor-text-body">{highlightedEditors.summary}</p>
            </div>
          </Link>
        )}

        <div className="right-homepage">
          {highlightedNews && (
            <Link href={`news/${highlightedNews.id}`} className="news-component"
              aria-label="link-to-featured-news"
              style={{ backgroundImage: `url(${highlightedNews.image || ""})` }}
            >
              <div className="news-text">
                <h2 className="news-text-header">{highlightedNews.title || ""}</h2>
                <p className="news-text-body">{highlightedNews.summary || ""}</p>
              </div>
            </Link>
          )}

          {highlightedPlaylists.map((playlist, index) => (
            <Link href={playlist.link} key={playlist.id} className="playlist-component">
              <button className="playlist-button">Listen</button>
              <Image
                src={playlist.imageUrl}
                alt={playlist.title}
                className="highlighted-playlist-image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority={index === 0}
              />
            </Link>
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
