import React, { useState } from 'react';

const CreateArticleForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSave = () => {
    // Validate the form fields if needed
    // ...

    // Call the onSave function with the new article data
    onSave({ title, content });

    // Reset form fields
    setTitle('');
    setContent('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    // Handle the selected image
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className="create-article-form">
      <h2>Create New Article</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Content:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <label>
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateArticleForm;
