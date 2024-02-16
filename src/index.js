import React from 'react';
import App from './App';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { hydrate, render } from "react-dom";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <React.StrictMode>
      <Analytics/>
      <SpeedInsights/>
      <App />
    </React.StrictMode>,
    rootElement
  );
} else {
  render(
    <React.StrictMode>
      <Analytics/>
      <SpeedInsights/>
      <App />
    </React.StrictMode>,
    rootElement
  );
}
