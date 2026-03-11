"use client";

import React, { useState } from "react";
import { database, storage } from "@/firebase/firebase";
import { collection, addDoc, setDoc, getDocs, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import "./playlist-form.css";

const HighlightPlaylist = ({ onSave, onCancel }) => {

  const initialHighlight = {
    title: "",
    image: null,
    link: "",
    summary: "",
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

      if (!playlistData.image) {
        alert("Please upload an image");
        return;
      }

      // Create unique filename
      const fileName = `${Date.now()}-${playlistData.image.name}`;

      // Upload image to storage
      const storageRef = ref(storage, `playlist_images/${fileName}`);
      await uploadBytes(storageRef, playlistData.image);

      // Get image URL
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore references
      const playlistsCollectionRef = collection(database, "playlists");
      const highlightsCollectionRef = collection(database, "Playlisthighlights");

      // Save playlist
      await addDoc(playlistsCollectionRef, {
        image: downloadURL,
        link: playlistData.link,
        summary: playlistData.summary,
        timestamp: Timestamp.now(),
        title: playlistData.title,
      });

      // Check highlight collection
      const querySnapshot = await getDocs(highlightsCollectionRef);

      if (querySnapshot.empty) {

        await addDoc(highlightsCollectionRef, {
          image: downloadURL,
          link: playlistData.link,
          title: playlistData.title,
        });

      } else {

        const existingDoc = querySnapshot.docs[0];

        await setDoc(existingDoc.ref, {
          image: downloadURL,
          link: playlistData.link,
          title: playlistData.title,
        });

      }

      alert("Playlist created successfully!");

      setPlaylistData({ ...initialHighlight });

      if (onSave) {
        onSave(playlistData);
      }

    } catch (error) {
      console.error(error);
      alert("Error saving playlist");
    }
  };

  const handleCancel = () => {
    setPlaylistData({ ...initialHighlight });

    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <AdminLayout>

      <div className="playlist-highlighted">

        <form onSubmit={handleSubmit} className="playlist-form">

          <h1>Create New Playlist</h1>

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
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <div className="playlist-title">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={playlistData.title}
              onChange={handleInputChange}
              required
              placeholder="Playlist title"
            />
          </div>

          <div className="playlist-link">
            <label>Link</label>

            <input
              type="text"
              name="link"
              value={playlistData.link}
              onChange={handleInputChange}
              required
              placeholder="Playlist link"
            />
          </div>

          <div className="playlist-summary">
            <label>Summary</label>

            <textarea
              name="summary"
              value={playlistData.summary}
              onChange={handleInputChange}
              placeholder="Write playlist summary"
              required
            />
          </div>

          <div className="form-buttons">

            <button
              type="button"
              onClick={handleCancel}
              className="btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn"
            >
              Create
            </button>

          </div>

          <Link href="/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/update-playlist">
            Update Playlists
          </Link>

        </form>

      </div>

    </AdminLayout>
  );
};


const UpdatePlaylist = () => {

  const handleSave = (playlistData) => {
    console.log("Saved playlist:", playlistData);
  };

  const handleCancel = () => {
    console.log("Playlist creation cancelled");
  };

  return (
    <div>
      <HighlightPlaylist
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default UpdatePlaylist;