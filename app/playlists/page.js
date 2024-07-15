import { database } from "@/firebase/firebase";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";
import React from 'react';
import Playlists from "./Playlists";

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
export default async function page() {
    const playlists = await fetchPlaylists();

    return (
        <Playlists
            isPlayListManager={false}
            playlists={JSON.parse(JSON.stringify(playlists))}
        />)
}
