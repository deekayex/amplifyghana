import { database } from "@/firebase/firebase";
import { collection, query, orderBy, getDocs } from "@firebase/firestore";
import { Metadata } from "next";
import Playlists from "./Playlists";

export const metadata: Metadata = {
  title: "Playlists | Amplify Ghana",
  description:
    "Amplify Ghana is an Online Creative’s Promotion and Public Relations Agency Founded in 2020. Our Primary Mission is to Elevate Creatives Throughout Africa, With a Special Focus on Ghana, As that is Where We are Headquartered.",
};

// const fetchPlaylists = async () => {
//   try {
//     const playlistsCollection = collection(database, "playlists");
//     const playlistsQuery = query(
//       playlistsCollection,
//       orderBy("timestamp", "desc")
//     );
//     const playlistsSnapshot = await getDocs(playlistsQuery);

//     const playlistsData = playlistsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return playlistsData;
//   } catch (error) {
//     console.error("Error fetching playlists:", error);
//   }
// };
export default async function PlaylistLayout({ children }) {
  // const playlists = await fetchPlaylists();

  return (
    <section>
      <Playlists
        isPlayListManager={false}
        // playlists={JSON.parse(JSON.stringify(playlists))}
      />
    </section>
  );
}
