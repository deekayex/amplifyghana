import React, { useState } from 'react';
import Modal from 'react-modal';
import CreateArticleForm from '../editor/CreateArticleForm';

Modal.setAppElement('#root'); // Set the root element for accessibility

const CreateArticleModal = ({ onSave, onCancel, isOpen }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSave = () => {
    onSave({ title, content });
    setTitle('');
    setContent('');
    setImage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Create Article Modal"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <span className="close" onClick={onCancel}>&times;</span>
        <CreateArticleForm onSave={handleSave} onCancel={onCancel} />
      </div>
    </Modal>
  );
};

export default CreateArticleModal;
