import Image from 'next/image';
import React, { useState } from 'react';

const CreateArticleSummary = ({ title, summary, onSummaryChange, onImageChange, onSectionChange, onNext, onPrevious, setImage }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Display image preview
    const previewURL = URL.createObjectURL(selectedImage);
    setImagePreview(previewURL);

    // Pass the selected image to the parent component
    onImageChange(selectedImage);
  };

  return (
    <div className='create-article-form-container'>
      <h2>Step 2: Article Details</h2>
      <label className='article-section'>
        Select Section
        <select onChange={onSectionChange} required className='select-category'> 
          <option value="news">News</option>
          <option value="editors-picks">Editors Picks</option>
        </select>
      </label>

      <div className='create-article-step2'>
        <label>
          <input type="file" accept="image/*" onChange={handleImageChange} className='image-picker'/>
        </label>
        {imagePreview && (
          <div>
            <Image src={imagePreview} alt="Image Preview" className='set-image'    width={100}
                  height={100}/>
          </div>
        )}
        <label>
        <label className='create-article-title'>
          {title}
        </label>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Article summary"
            className="article-summary"
          />
        </label>
      </div>
      <div className='buttons-flex'>
        <button onClick={onPrevious} className='btn'>Previous</button>
        <button onClick={onNext} className='btn'>Next</button>
      </div>
    </div>
  );
};

export default CreateArticleSummary;
