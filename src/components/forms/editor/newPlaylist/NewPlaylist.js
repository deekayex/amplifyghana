import React, { useState } from 'react';
import './NewPlaylist.css'

const NewPlaylistForm = ({ onSave, onCancel }) => {
  const initialPlaylistData = {
    title: '',
    summary: '',
    image: null,
    link: '',
  };

  const [playlistData, setPlaylistData] = useState({ ...initialPlaylistData });

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
      await onSave(playlistData);
      // Reset form state on successful save
      setPlaylistData({ ...initialPlaylistData });
    } catch (error) {
      console.error('Error saving playlist:', error);
    }
  };

  const handleCancel = () => {
    // Reset form state on cancel
    setPlaylistData({ ...initialPlaylistData });
    onCancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <form onSubmit={handleSubmit} className='playlist-form'>
      <label>Title:</label>
      <input type='text' name='title' value={playlistData.title} onChange={handleInputChange} required />

      <label>Summary:</label>
      <textarea name='summary' value={playlistData.summary} onChange={handleInputChange} required className='playlist-summary'/>

      <label>Image:</label>
      <input type='file' name='image' accept='image/*' onChange={handleImageChange} required />

      <label>Link:</label>
      <input type='text' name='link' value={playlistData.link} onChange={handleInputChange} required/>

      <div className='form-buttons'>
        <button type='submit'>
          Create Playlist
        </button>
        <button type='button' onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewPlaylistForm;
