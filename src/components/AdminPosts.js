import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../firebase/firebase';
import { collection, doc, setDoc } from '@firebase/firestore';
import CreateArticleForm from './forms/editor/createArticle/CreateArticleForm';
import { serverTimestamp } from 'firebase/firestore';

const AdminPosts = () => {
  const [isArticleFormVisible, setArticleFormVisible] = useState(false);

  const handleCreateFormCancel = () => {
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
        return; // Abort further execution
      }

      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);

      // Generate custom document ID from title
      const customDocId = title.toLowerCase().replace(/\s+/g, '-');

      

      const newArticleRef = await setDoc(doc(collection(database, collectionName), customDocId), {
        title,
        summary,
        content,
        image: downloadURL,
        timestamp: serverTimestamp(),
      });

      alert('New article created successfully!');
      setArticleFormVisible(false);
    } catch (error) {
      alert('Error creating new article', error);
    }
  };

  return (
    <div>
      <CreateArticleForm onSave={handleSaveNewArticle} onCancel={handleCreateFormCancel} />
    </div>
  );
};

export default AdminPosts;
