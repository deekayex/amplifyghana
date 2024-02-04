import React from 'react'
import App from './App'
import './index.css'
import  ReactDOM  from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     {/* <Analytics> */}
      <App />
    <Analytics/>
  </React.StrictMode>
);