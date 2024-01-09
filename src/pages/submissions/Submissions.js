import React, { useState, useEffect } from 'react';
import BasicForm from '../../components/forms/Form';
import './Submissions.css';

function Submissions() {
  const handleSubmit = async (values, setSubmitting) => {
    // Your form submission logic here
  };


  return (
    <section className='submissions-container' id='submissions'>
      <div className='space' />
      <div className='forms-container'>
        Reach out to us
        <div className='form-container'>
          <BasicForm onSubmit={handleSubmit}/>
        </div>
      </div>      
    </section>
  );
}

export default Submissions;
