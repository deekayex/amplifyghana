"use client";
import React, { useState } from "react";
import { database, storage } from "@/firebase/firebase";
import { collection, addDoc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function CreatePlaylist() {
  const initial = { title: "", link: "", summary: "", playlistImage: null, highlightImage: null };
  const [form, setForm] = useState(initial);
  const [previews, setPreviews] = useState({ playlist: null, highlight: null });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (field) => (e) => {
    const file = e.target.files[0];
    setForm({ ...form, [field]: file });
    setPreviews({ ...previews, [field === "playlistImage" ? "playlist" : "highlight"]: file ? URL.createObjectURL(file) : null });
  };

  const uploadImage = async (file, folder) => {
    const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.playlistImage || !form.highlightImage) return alert("Please upload both images");
    setLoading(true);
    try {
      const [playlistImageURL, highlightImageURL] = await Promise.all([
        uploadImage(form.playlistImage, "playlist_images"),
        uploadImage(form.highlightImage, "playlist_highlight_images"),
      ]);

      // Save to playlists collection
      await addDoc(collection(database, "playlists"), {
        title: form.title,
        link: form.link,
        summary: form.summary,
        image: playlistImageURL,
        highlightImage: highlightImageURL,
        timestamp: Timestamp.now(),
      });

      // Overwrite the single highlight doc
      const highlightsSnap = await getDocs(collection(database, "Playlisthighlights"));
      const payload = { image: highlightImageURL, link: form.link, title: form.title };
      if (highlightsSnap.empty) {
        await addDoc(collection(database, "Playlisthighlights"), payload);
      } else {
        await setDoc(highlightsSnap.docs[0].ref, payload);
      }

      alert("Playlist created and set as highlight!");
      setForm(initial);
      setPreviews({ playlist: null, highlight: null });
    } catch (err) {
      console.error(err);
      alert("Error creating playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1>Create playlist</h1>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required placeholder="Playlist title" disabled={loading} />

        <label>Link</label>
        <input name="link" value={form.link} onChange={handleChange} required placeholder="https://..." disabled={loading} />

        <label>Summary</label>
        <textarea name="summary" value={form.summary} onChange={handleChange} required placeholder="Write a short summary" disabled={loading} />

  <div className="upload-divider">
  <hr /><span>Playlist image</span><hr />
</div>
<div className="form-field">
  <div
    className="image-preview"
    style={previews.playlist ? { backgroundImage: `url(${previews.playlist})` } : {}}
  >
    {!previews.playlist && <span>No image selected</span>}
  </div>
  <div className="upload-box" onClick={() => document.getElementById('playlist-img').click()}>
    <div className="upload-icon">
      <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M8 11V3M5 6l3-3 3 3"/><path d="M3 13h10"/>
      </svg>
    </div>
    <span className="upload-label">Click to upload</span>
    <span className="upload-hint">PNG, JPG up to 10MB</span>
    <input id="playlist-img" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage("playlistImage")} required />
  </div>
</div>

<div className="upload-divider">
  <hr /><span>Highlight image</span><hr />
</div>
<div className="form-field">
  <div
    className="image-preview"
    style={previews.highlight ? { backgroundImage: `url(${previews.highlight})` } : {}}
  >
    {!previews.highlight && <span>No image selected</span>}
  </div>
  <div className="upload-box" onClick={() => document.getElementById('highlight-img').click()}>
    <div className="upload-icon">
      <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M8 11V3M5 6l3-3 3 3"/><path d="M3 13h10"/>
      </svg>
    </div>
    <span className="upload-label">Click to upload</span>
    <span className="upload-hint">PNG, JPG up to 10MB</span>
    <input id="highlight-img" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage("highlightImage")} required />
  </div>
</div>
        <Link href="/cjuyu579ugnwh45h9mnhkulpnkzx6vwr0bni5pg3qsd9i0nh804w5gors9ihnyl8g4pa230uleij16ktraamuwi517/manage-playlists" style={{ display: "block", marginTop: 16 }}>
          Manage playlists →
        </Link>
      </form>
    </AdminLayout>
  );
}

