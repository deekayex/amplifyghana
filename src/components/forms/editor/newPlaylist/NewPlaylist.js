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
      <h className>Create New Playlist</h>
      <div className='new-playlist-container'>
        <div className='new-playlist-image-container'style={{
            backgroundImage: playlistData.image ? `url(${URL.createObjectURL(playlistData.image)})` : 'none',
          }}>
          
        </div>
      <textarea name='summary' value={playlistData.summary} onChange={handleInputChange} required className='playlist-summary' placeholder='write article summary here'/>

      </div>

      
      <input type='file' name='image' accept='image/*' onChange={handleImageChange} required />

      
      <input type='text' name='title' value={playlistData.title} onChange={handleInputChange} required placeholder='Type the Playlist title' className='playlist-title'/>

      <label>Link:</label>
      <input type='text' name='link' value={playlistData.link} onChange={handleInputChange} required className='playlist-link'/>

      <div className='form-buttons'>
      <div className='playlist-buttons-flex'>
      <button type='button' onClick={handleCancel} className='btn'>
          Cancel
        </button>
        
        <button type='submit' className='btn'>
          Create 
        </button>
       
      </div>
      </div>
    </form>
  );
};

export default NewPlaylistForm;
