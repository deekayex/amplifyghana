import React from 'react';
import BasicForm from '../../components/forms/Form';
import './Submissions.css';
import ScrollToTopOnMount from '../../components/ScrollToTop';

function Submissions() {
  const handleSubmit = async (values, setSubmitting) => {
    // Form submission logic here
  };


  return (
    <section className='submissions-container' id='submissions'>
      <ScrollToTopOnMount/>
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
