// Step 3: StepThree.js
import React from 'react';
import Editor from '../../constants/textEditor/EditorQuill';

const CreateArticleContents = ({ content, onContentChange, onSave, onPrevious, onCancel }) => (
  <div className='create-article-contents-container'>
    <h2>Step 3: Article Content</h2>
    <label>
      Content:
      <Editor 
        theme="snow"
        value={content}
        onChange={onContentChange}
        className="article-content"
      />
    </label>
    <div className='buttons-flex-2'>
    <button onClick={onPrevious} className='btn'>Previous</button>
    <button onClick={onSave} className='btn'>Save</button>
    <button onClick={onCancel} className='btn'>Cancel</button>
    </div>
  </div>
);


export default CreateArticleContents;
