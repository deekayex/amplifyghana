import React, { useState } from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; // Import useHistory

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useHistory

  const login = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      alert('Login successful');
      navigate('/admin'); // Redirect to the dashboard or any other route
    } catch (error) {
      console.log(error);
      alert('Login unsuccessful');
    }
  };

  return (
 <div className='login-page'>
  <div className='space' />
  <div className='login-form-container'>
    <div className='login-form'>
      <div className='login-form-inputs'>
        <div className='login-input'>
          <img src={process.env.PUBLIC_URL + '/account.svg'} alt='profile' className='user-email-image'/>
          <input
            type='email' placeholder='email address' value={email} onChange={(e) => setEmail(e.target.value)} className='email-input' />
          </div>

          <div className='login-input'>
            <img src={process.env.PUBLIC_URL + '/password.svg'} alt='profile' className='user-email-image'/>
            <input
                type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} className='password-input' />
            </div>

              <button onClick={login} className='login-submit-button'>Submit</button>
      </div>
      </div>
   </div>
  </div>
  );
};

export default LoginPage;
