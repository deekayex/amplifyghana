import { database, storage } from '@/firebase/firebase';
import { serverTimestamp } from '@/firebase/firestore';
import { collection, doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import CreateArticleForm from './forms/editor/createArticle/CreateArticleForm';


const AdminPosts = () => {
  const [setArticleFormVisible] = useState(false);

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
      const customDocId = title.toLowerCase().replace(/[^\w\s-"]/g, '').replace(/\s+/g, '-');


      await setDoc(doc(collection(database, collectionName), customDocId), {
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
