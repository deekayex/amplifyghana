import React, { useState, useEffect } from 'react';
import './CreateArticleForm.css';
import 'react-quill/dist/quill.snow.css';
import Editor from '../../../constants/textEditor/EditorQuill';


const CreateArticleForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('news');
  const [initialContent, setInitialContent] = useState('');


 // Set initial content when the component mounts
 useEffect(() => {
  // You may fetch initial content from an API or any other source here
  const fetchedInitialContent = "Initial content fetched from a source";
  setInitialContent(fetchedInitialContent);
}, []); // Empty dependency array ensures that this effect runs only once when the component mounts

const handleContentChange = (newContent) => {
  setContent(newContent);
};

const handleImageChange = (e) => {
  const selectedImage = e.target.files[0];
  setImage(selectedImage);
};

const handleSave = () => {
  onSave({ title, summary, image, selectedSection, content });
  setTitle('');
  setSummary('');
  setContent('');
  setImage(null);
  setSelectedSection('news');
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
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      <label>
        Section:
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          required
        >
          <option value="news">News</option>
          <option value="editors-picks">Editors Picks</option>
        </select>
      </label>

      <label>
        Content:
        <Editor 
          theme="snow"
          value={content}
          onChange={handleContentChange}
          initialValue={initialContent}
          className="article-content"
        />
      </label>

      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CreateArticleForm;
