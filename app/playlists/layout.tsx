import { database } from "@/firebase/firebase";
import { collection, query, orderBy, getDocs } from "@firebase/firestore";
import { Metadata } from "next";
import Playlists from "./Playlists";
import React from "react";

const fetchPlaylists = async () => {
  try {
    const playlistsCollection = collection(database, "playlists");
    const playlistsQuery = query(playlistsCollection, orderBy("timestamp", "desc"));
    const playlistsSnapshot = await getDocs(playlistsQuery);

    return playlistsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title || "Untitled Playlist",
      summary: doc.data().summary || "No description available.",
      image: doc.data().image || "/default-image.jpg",
      link: doc.data().link || "#",
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const playlists = await fetchPlaylists();
  const firstPlaylist = playlists.length > 0 ? playlists[0] : null;

  return {
    title: "Playlists | Amplify Ghana",
    description: firstPlaylist
      ? firstPlaylist.summary
      : "Explore curated playlists from Amplify Ghana.",
    openGraph: {
      title: firstPlaylist ? firstPlaylist.title : "Playlists | Amplify Ghana",
      description: firstPlaylist
        ? firstPlaylist.summary
        : "Explore curated playlists from Amplify Ghana.",
      url: firstPlaylist
        ? `https://www.amplifyghana.com/playlists/${firstPlaylist.id}`
        : "https://www.amplifyghana.com/playlists",
      type: "website",
      images: firstPlaylist ? [{ url: firstPlaylist.image }] : [{ url: "/default-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: firstPlaylist ? firstPlaylist.title : "Playlists | Amplify Ghana",
      description: firstPlaylist
        ? firstPlaylist.summary
        : "Explore curated playlists from Amplify Ghana.",
      images: firstPlaylist ? [firstPlaylist.image] : ["/default-image.jpg"],
    },
  };
}

export default async function PlaylistLayout({ children }: { children: React.ReactNode }) {
  const playlists = await fetchPlaylists();

  return (
    <section>
      <Playlists isPlayListManager={false} playlists={playlists} />
      {/* {children} */}
    </section>
  );
}
