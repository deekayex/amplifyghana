"use client";
import React, { useState } from 'react';
import CreateArticleTitle from '../../../components/forms/newArticle/CreateArticleTitle';
import CreateArticleSummary from '../../../components/forms/newArticle/CreateArticleSummary';
import CreateArticleContents from '../../../components/forms/newArticle/CreateArticleContents';
import './CreateArticleForm.css'
import AdminLayout from '@/components/admin/AdminLayout';

const CreateArticleForm = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState(null);
  const [selectedSection, setSelectedSection] = useState('news');
  const [content, setContent] = useState('');

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleSummaryChange = (newSummary) => {
    setSummary(newSummary);
  };

  const handleImageChange = (selectedImage) => {
    setImage(selectedImage);
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    console.log(newContent)
  };

  const handleNext = () => {
    // Validation check for each stage
    if (step === 1 && title.trim() === '') {
      alert('Charley where the title dey?');
      return;
    }
    if (step === 2 && (summary.trim() === '' || !image || selectedSection.trim() === '')) {
      alert('Charley you no fill the page finish!');
      return;
    }

    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    // Validation check for the last step
    if (content.trim() === '') {
      alert('Charley you not type all oo!');
      return;
    }

    onSave({ title, summary, image, selectedSection, content });
    setStep(1); // Reset the form to Step 1
    setTitle('');
    setSummary('');
    setImage(null);
    setSelectedSection('news');
    setContent('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CreateArticleTitle title={title} onTitleChange={handleTitleChange} onNext={handleNext} />;
      case 2:
        return (
          <CreateArticleSummary
            title={title}
            summary={summary}
            onSummaryChange={handleSummaryChange}
            onImageChange={handleImageChange}
            onSectionChange={handleSectionChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return <CreateArticleContents content={content} onContentChange={handleContentChange} onSave={handleSave} onPrevious={handlePrevious} onCancel={onCancel} />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
    <div className="create-article-form">
      {renderStep()}
    </div>
    </AdminLayout>
  );
};

export default CreateArticleForm;
