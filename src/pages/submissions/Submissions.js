import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import BasicForm from '../../components/forms/Form';
import './Submissions.css';

function Submissions() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the subscription to avoid memory leaks
    return () => unsubscribe();
  }, []);

  const handleSubmit = async() =>{

  };

  return (
    <section className='submissions-container' id='submissions'>
      <div className='space' />
      <div></div>
      <div className='forms-container'>
        Reach out to us
        <div className='form-container'>
          <BasicForm />
        </div>
      </div>
      {user ? (
        <button onClick={handleSubmit} className='sign-out'>Sign Out</button>
      ) : (
        <Link to='/login'>Sign In</Link>
      )}
    </section>
  );
}

export default Submissions;
