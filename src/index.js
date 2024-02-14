import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <React.StrictMode>
      <App />
      <Analytics />
      <SpeedInsights />
    </React.StrictMode>,
    rootElement
  );
} 

// else {
//   ReactDOM.render(
//     <React.StrictMode>
//       <App />
//       <Analytics />
//       <SpeedInsights />
//     </React.StrictMode>,
//     rootElement
//   );
// }
