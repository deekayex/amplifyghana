import React from 'react'
import App from './App'
import './index.css'
import  ReactDOM  from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <App />
    <Analytics/>
    <SpeedInsights />
  </React.StrictMode>
);