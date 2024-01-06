import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from '@firebase/firestore';

import './CreateArticleForm.css';


const CreateArticleForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('news');
  const [isArticleFormVisible, setArticleFormVisible] = useState(false);

  const handleSave = () => {
    onSave({ title, content, summary, image, selectedSection });
    setTitle('');
    setSummary('');
    setContent('');
    setImage(null);
    setSelectedSection('news'); 
  };
  const handleCreateFormCancel = () => {
    // Handle cancel button click for the Create Article Form
    setArticleFormVisible(false);
  };

  const handleSaveNewArticle = async (newArticleData) => {
    try {
      const { title, summary, content, image, selectedSection } = newArticleData;

      const storageRef = ref(storage, 'article_images/' + image.name);

      let collectionName;

          if (selectedSection === 'news') {
            collectionName = 'news';
          } else if (selectedSection === 'editors-picks') {
            collectionName = 'editors-picks';
          } else {
            alert('Invalid section selected!');
          }


      await uploadBytes(storageRef, image);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Add the new article to the Firestore collection with the image URL
      const newArticleRef = await addDoc(collection(database, collectionName), {
        title,
        summary,
        content,
        image: downloadURL, // Use the URL obtained from Firebase Storage
      });

      alert('New article created successfully!');
      setArticleFormVisible(false);
    } catch (error) {
      console.error('Error creating new article', error);
    }
  };


  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className="create-article-form">
      <h2>Create New Article</h2>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="article-input-title"
        />
      </label>
      <label>
        Summary:
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Article summary"
          className="article-summary"
        />
      </label>
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <label>
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <label>
        Section:
        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}  required>
          <option value="news">News</option>
          <option value="editors-picks">Editors Picks </option>
          
        </select>
      </label>
      <button onClick={handleSave }>Save</button>
      {/* <button onClick={console.log(selectedSection) }>Save</button> */}
      
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateArticleForm;
