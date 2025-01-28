"use client";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import ScrollToTopOnMount from "../../components/ScrollToTop";
import { database } from "../../firebase/firebase";
import "./Playlists.css";
import Image from "next/image";

const PLAYLIST_BUTTON_TEXT = "LISTEN";
const fetchPlaylists = async () => {
  try {
    const playlistsCollection = collection(database, "playlists");
    const playlistsQuery = query(
      playlistsCollection,
      orderBy("timestamp", "desc")
    );
    const playlistsSnapshot = await getDocs(playlistsQuery);

    const playlistsData = playlistsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return playlistsData;
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};
const Playlists = ({ isPlayListManager, playlists }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState([]);
  const [textLimit, setTextLimit] = useState(700);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  //   useEffect(() => {
  //     const fetchPlaylists = async () => {
  //       try {
  //         const playlistsCollection = collection(database, "playlists");
  //         const playlistsQuery = query(
  //           playlistsCollection,
  //           orderBy("timestamp", "desc")
  //         );
  //         const playlistsSnapshot = await getDocs(playlistsQuery);

  //         const playlistsData = playlistsSnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));

  //         setPlaylists(playlistsData);
  //       } catch (error) {
  //         console.error("Error fetching playlists:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchPlaylists();
  //   }, []);

  const handleDeletePlaylist = async (id) => {
    const playlistDoc = doc(database, "playlists", id);
    await deleteDoc(playlistDoc);

    // setPlaylists((prevPlaylists) =>
    //   prevPlaylists.filter((playlist) => playlist.id !== id)
    // );
  };

  useEffect(() => {
    const handleResize = () => {
      setTextLimit(window.innerWidth >= 900 ? 700 : 255);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTogglePlaylist = (id) => {
    setExpandedPlaylistIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleListenButtonClick = (link) => {
    // Handle redirection when "LISTEN" button is clicked
    window.open(link, "_blank");
  };

  const handleShowLess = (id) => {
    setExpandedPlaylistIds((prevIds) =>
      prevIds.filter((prevId) => prevId !== id)
    );
  };

  return (
    <div className="playlist-page">
      <ScrollToTopOnMount />
      <div className="space" />
      <div className="playlist-header">
        <h1>Playlists</h1>
      </div>
      <div className="playlist-flex">
        {/* {isLoading ? (
          <LoadingPlaylists />
        ) : ( */}
        <div className="playlist-container">
          {playlists.map((playlist) => (
            <div className="playlist_component" key={playlist.id}>
              {isPlayListManager && user && (
                <button
                  className="delete-button"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                >
                  Delete
                </button>
              )}
              <div className="playlist_image">
                <a
                  href={playlist.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={playlist.image}
                    alt={playlist.altText || 'Playlist image'} 
                    className="picture"
                    // loading="lazy"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    priority
                  />
                </a>
              </div>
              <div className="playlist_text">
                {expandedPlaylistIds.includes(playlist.id) ? (
                  <>
                    {playlist.summary}
                    {playlist.summary.length >= textLimit && (
                      <button
                        className="show-less"
                        onClick={() => handleShowLess(playlist.id)}
                      >
                        Show Less
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {playlist.summary.slice(0, textLimit)}{" "}
                    {playlist.summary.length >= textLimit && (
                      <button
                        className="read-more"
                        onClick={() => handleTogglePlaylist(playlist.id)}
                      >
                        Click for more
                      </button>
                    )}
                  </>
                )}
                <button
                  className="playlist_button"
                  onClick={() => handleListenButtonClick(playlist.link)}
                >
                  {PLAYLIST_BUTTON_TEXT}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Playlists;
