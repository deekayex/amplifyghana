"use client"
import { useState, useEffect } from "react";
import { database } from "@/firebase/firebase";
import LoadingHome from "../../context/loading/HomeLoad/LoadingHome";
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

  if (playlistsSnapshot.empty) return null;

  const playlistDoc = playlistsSnapshot.docs[0];

  return {
    id: playlistDoc.id,
    ...serializeFirebaseDocument(playlistDoc),
  };
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
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [highlightedNews, highlightedEditors, highlightedPlaylists, newFeaturedAd] =
        await Promise.all([
          fetchHighlightedNews(database),
          fetchHighlightedEditors(database),
          fetchHighlightedPlaylists(database),
          fetchFeaturedAd(database),
        ]);
      setHomeData({ highlightedNews, highlightedEditors, highlightedPlaylists, newFeaturedAd });
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <LoadingHome />;
  }

  return <Home {...homeData} />;
}

function Home({ highlightedNews, highlightedEditors, highlightedPlaylists, newFeaturedAd }) {
  const editorsLink = highlightedEditors ? `editors-picks/${highlightedEditors.id}` : "";
  const newsLink = highlightedNews ? `news/${highlightedNews.id}` : "";

return (
    <div className="homepage-components">
      <div className="homepage-contents">

        {/* LEFT – EDITORS PICK */}
        {highlightedEditors && (
          <div
            className="left-homepage"
            style={{ backgroundImage: `url(${highlightedEditors.image})` }}
          >
            <Link href={editorsLink} className="card-link" aria-label="Featured editors pick" />

            <Link href="/editors-picks" className="sticker">
              <h3>EDITOR'S PICKS</h3>
            </Link>

            <div className="editor-text">
              <h2 className="editor-text-header">{highlightedEditors.title}</h2>
              <p className="editor-text-body">{highlightedEditors.summary}</p>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN */}
        <div className="right-homepage">

          {/* NEWS */}
          {highlightedNews && (
            <div
              className="news-component"
              style={{ backgroundImage: `url(${highlightedNews.image})` }}
            >
              <Link href={newsLink} className="card-link" aria-label="Featured news" />

              <Link href="/news" className="sticker">
                <h3>NEWS</h3>
              </Link>

              <div className="news-text">
                <h2 className="news-text-header">{highlightedNews.title}</h2>
                <p className="news-text-body">{highlightedNews.summary}</p>
              </div>
            </div>
          )}

          {/* PLAYLISTS */}
          {highlightedPlaylists && (
            <div className="playlist-component" key={highlightedPlaylists.id}>
              <Link href={highlightedPlaylists.link} className="card-link" />

              <Link href="/playlists" className="sticker">
                <h3>PLAYLISTS</h3>
              </Link>

              <Link href={highlightedPlaylists.link} className="playlist-button" target="_blank">
                Listen
              </Link>

              <Image
                src={highlightedPlaylists.image }
                alt={highlightedPlaylists.title}
                className="highlighted-playlist-image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* ADS */}
      <div className="bottom-homepage">
        {newFeaturedAd.map((ad) => (
          <FeaturedAd key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
}