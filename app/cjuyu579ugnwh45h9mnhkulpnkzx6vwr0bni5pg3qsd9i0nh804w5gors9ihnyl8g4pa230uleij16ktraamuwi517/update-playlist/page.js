"use client";

import React, { useState } from "react";
import { database, storage } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import "./playlist-form.css";

const HighlightPlaylist = ({ onSave, onCancel }) => {

  const initialHighlight = {
    title: "",
    playlistImage: null,
    highlightImage: null,
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

  const handlePlaylistImageChange = (e) => {
    const image = e.target.files[0];

    setPlaylistData({
      ...playlistData,
      playlistImage: image,
    });
  };

  const handleHighlightImageChange = (e) => {
    const image = e.target.files[0];

    setPlaylistData({
      ...playlistData,
      highlightImage: image,
    });
  };

  const handleSave = async () => {
    try {

      if (!playlistData.playlistImage || !playlistData.highlightImage) {
        alert("Please upload both images");
        return;
      }

      const playlistFileName = `${Date.now()}-${playlistData.playlistImage.name}`;
      const highlightFileName = `${Date.now()}-${playlistData.highlightImage.name}`;

      // Upload playlist image
      const playlistStorageRef = ref(storage, `playlist_images/${playlistFileName}`);
      await uploadBytes(playlistStorageRef, playlistData.playlistImage);
      const playlistImageURL = await getDownloadURL(playlistStorageRef);

      // Upload highlight image
      const highlightStorageRef = ref(storage, `playlist_highlight_images/${highlightFileName}`);
      await uploadBytes(highlightStorageRef, playlistData.highlightImage);
      const highlightImageURL = await getDownloadURL(highlightStorageRef);

      const playlistsCollectionRef = collection(database, "playlists");
      const highlightsCollectionRef = collection(database, "Playlisthighlights");

      // Save playlist
      await addDoc(playlistsCollectionRef, {
        image: playlistImageURL,
        link: playlistData.link,
        summary: playlistData.summary,
        timestamp: Timestamp.now(),
        title: playlistData.title,
      });

      // Check highlight collection
      const querySnapshot = await getDocs(highlightsCollectionRef);

      if (querySnapshot.empty) {

        await addDoc(highlightsCollectionRef, {
          image: highlightImageURL,
          link: playlistData.link,
          title: playlistData.title,
        });

      } else {

        const existingDoc = querySnapshot.docs[0];

        await setDoc(existingDoc.ref, {
          image: highlightImageURL,
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

          {/* Playlist Image Preview */}
          <div className="new-playlist-container">
            <div
              className="new-playlist-image-container"
              style={{
                backgroundImage: playlistData.playlistImage
                  ? `url(${URL.createObjectURL(playlistData.playlistImage)})`
                  : "none",
              }}
            >
               <label>Playlist Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePlaylistImageChange}
            required
          />
            </div>
          </div>

         

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

 <label>Highlighted Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleHighlightImageChange}
            required
          />
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