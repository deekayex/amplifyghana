import React, { useState, useEffect } from 'react';
import BasicForm from '../../components/forms/Form';
import './Submissions.css';

function Submissions() {
  const handleSubmit = async (values, setSubmitting) => {
    // Form submission logic here
  };


  return (
    <section className='submissions-container' id='submissions'>
      <div className='space' />
      <div className='forms-container'>
        <div className='form-header-text'>Reach out to us</div>
        <div className='form-container'>
          <BasicForm onSubmit={handleSubmit}/>
        </div>
      </div>      
    </section>
  );
}

export default Submissions;
