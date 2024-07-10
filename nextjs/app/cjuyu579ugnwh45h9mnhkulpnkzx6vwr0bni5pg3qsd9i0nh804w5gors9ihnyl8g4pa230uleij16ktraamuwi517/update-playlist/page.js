"use client";
import React, { useState } from "react";
import { database, storage } from "../../../firebase/firebase";
import { collection, addDoc, setDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

const HighlightPlaylist = ({ onSave, onCancel }) => {
  const initialHighlight = {
    title: "",
    image: null,
    link: "",
  };

  const [playlistData, setPlaylistData] = useState({ ...initialHighlight });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaylistData({
      ...playlistData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setPlaylistData({
      ...playlistData,
      image,
    });
  };

  const handleSave = async () => {
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, "highlight/" + playlistData.image.name);
      await uploadBytes(storageRef, playlistData.image);
      const downloadURL = await getDownloadURL(storageRef);

      // Check if a document already exists in the collection
      const highlightsCollectionRef = collection(
        database,
        "Playlisthighlights"
      );
      const querySnapshot = await getDocs(highlightsCollectionRef);

      if (querySnapshot.empty) {
        // If no document exists, create a new one
        const newHighlightRef = await addDoc(highlightsCollectionRef, {
          title: playlistData.title,
          link: playlistData.link,
          imageUrl: downloadURL,
        });
        alert("Document written with ID: ", newHighlightRef.id);
      } else {
        // If a document exists, update its fields
        const existingDoc = querySnapshot.docs[0];
        await setDoc(existingDoc.ref, {
          title: playlistData.title,
          link: playlistData.link,
          imageUrl: downloadURL,
        });
        console.log("Document updated with ID: ", existingDoc.id);
      }

      // Reset form state on successful save
      setPlaylistData({ ...initialHighlight });
    } catch (error) {
      alert("Error saving playlist:", error);
    }
  };

  const handleCancel = () => {
    // Reset form state on cancel
    setPlaylistData({ ...initialHighlight });
    onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <AdminLayout>
    <div className="playlist-highlighted">
      <form onSubmit={handleSubmit} className="playlist-form">
        <h className>Create New Playlist Highlight</h>
        <div className="new-playlist-container">
          <div
            className="new-playlist-image-container"
            style={{
              backgroundImage: playlistData.image
                ? `url(${URL.createObjectURL(playlistData.image)})`
                : "none",
            }}
          ></div>
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <input
          type="text"
          name="title"
          value={playlistData.title}
          onChange={handleInputChange}
          required
          placeholder="Type the Playlist title"
          className="playlist-title"
        />

        <label>Link:</label>
        <input
          type="text"
          name="link"
          value={playlistData.link}
          onChange={handleInputChange}
          required
          className="playlist-link"
        />

        <div className="form-buttons">
          <div className="playlist-buttons-flex">
            <button type="button" onClick={handleCancel} className="btn">
              Cancel
            </button>

            <button type="submit" className="btn">
              Create
            </button>
          </div>

          <Link href="/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/update-playlist">
            Update Playlists
          </Link>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
};

export default HighlightPlaylist;
