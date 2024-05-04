import React from 'react';

const CreateArticleTitle = ({ title, onTitleChange, onNext }) => (
  <div className='create-article-title-container'>
    <h2>Step 1: Article Title</h2>
    <label>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Article title"
        className="article-input-title"
      />
    </label>
    <button onClick={onNext} className='btn'>Next</button>
  </div>
);

export default CreateArticleTitle;
