import React , {useState} from 'react'
import './Login.css'
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../../firebase/firebase'


const LoginPage = () => {
  const [email, setEmail]= useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
  e.preventDefault();

  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password). then((userCredential) => {
      console.log(userCredential);})
      console.log('login succesful');
    }
  catch(error){
    console.log(error);
  }
}

  return (
    <div className='login-page'>
      <div className='space'/>
      
      <div className='sum'>
          Login
      </div>
      <div className='login-form'>
        <div className='login-form-input'>
          <input 
          type='email' placeholder='email address' value={email} onChange={(e) => setEmail(e.target.value)} className='email-input'/>
          <input
           type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} className='password-input'/>
          <button onClick={login} className='login-submit-button'>Submit</button>
        </div>         
      </div>
    </div>
  )
}

export default LoginPage