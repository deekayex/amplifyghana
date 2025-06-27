"use client";

import { deleteDoc, doc } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import ScrollToTopOnMount from "../../components/ScrollToTop";
import { database } from "../../firebase/firebase";
import "./Playlists.css";
import Image from "next/image";
import LoadingPlaylists from "@/context/loading/PlayListLoad/LoadingPlaylists";

const PLAYLIST_BUTTON_TEXT = "LISTEN";

const Playlists = ({ isPlayListManager, playlists }) => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState([]);
  const [textLimit, setTextLimit] = useState(700);

  // ✅ Fix: Ensure authentication state is handled properly
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (playlists?.length > 0) {
      setIsLoading(false);
    }
  }, [playlists]);

  // ✅ Fix: Ensure UI updates based on screen size
  useEffect(() => {
    const handleResize = () => {
      setTextLimit(window.innerWidth >= 900 ? 700 : 255);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle playlist expansion
  const handleTogglePlaylist = (id) => {
    setExpandedPlaylistIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]
    );
  };

  const handleDeletePlaylist = async (id) => {
    await deleteDoc(doc(database, "playlists", id));
  };

  return (
    <div className="playlist-page">
      <ScrollToTopOnMount />
      <div className="space" />
      <div className="playlist-header">
        <h1>Playlists</h1>
      </div>

      {isLoading ? (
        <LoadingPlaylists />
      ) : playlists.length > 0 ? (
        <div className="playlist-flex">
          <div className="playlist-container">
            {playlists.map((playlist) => (
              <div className="playlist_component" key={playlist.id}>
                {isPlayListManager && user && (
                  <button className="delete-button" onClick={() => handleDeletePlaylist(playlist.id)}>
                    Delete
                  </button>
                )}
                <div className="playlist_image">
                  <a href={playlist.link} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={playlist.image || "/default-image.jpg"}
                      alt={playlist.altText || "Playlist image"}
                      className="picture"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </a>
                </div>
                <div className="playlist_text">
                  {expandedPlaylistIds.includes(playlist.id) ? (
                    <>
                      {playlist.summary}
                      {playlist.summary.length >= textLimit && (
                        <button className="show-less" onClick={() => handleTogglePlaylist(playlist.id)}>
                          Show Less
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {playlist.summary.slice(0, textLimit)}{" "}
                      {playlist.summary.length >= textLimit && (
                        <button className="read-more" onClick={() => handleTogglePlaylist(playlist.id)}>
                          Click for more
                        </button>
                      )}
                    </>
                  )}
                  <button className="playlist_button" onClick={() => window.open(playlist.link, "_blank")}>
                    {PLAYLIST_BUTTON_TEXT}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No playlists found.</p>
      )}
    </div>
  );
};

export default Playlists;
