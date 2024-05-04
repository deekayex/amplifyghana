const express = require('express');
const path = require('path');
const compression = require('compression');
const dotenv = require('dotenv');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { createStore, applyMiddleware } = require('redux');
const { Provider } = require('react-redux');
const thunk = require('redux-thunk');
const helmet = require('helmet');

// Import your React App component and reducers
const App = require('./App').default;
const reducers = require('./build/client/reducers').default;

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable gzip compression
app.use(compression());

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'build'), { maxAge: '30d' }));

// Handle all other requests with SSR
app.get('*', (req, res) => {
  // Initialize Redux store
  const store = createStore(reducers, applyMiddleware(thunk));

  // Generate HTML markup with ReactDOMServer.renderToString
  const jsx = React.createElement(
    Provider,
    { store: store },
    React.createElement(
      StaticRouter,
      { location: req.url, context: {} },
      React.createElement(App)
    )
  );

  const staticHtml = ReactDOMServer.renderToString(jsx);
  const preloadedState = store.getState();

  const finalHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Amplify Ghana</title>
        <link rel="icon" href="favicon.ico"/>
        ${helmet.renderTags()}
      </head>
      <body>
        <div id="app">${staticHtml}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\\u003c')}
        </script>
        <script src="/index.js"></script>
      </body>
    </html>
  `;

  res.send(finalHtml);
});

const PORT = process.env.PORT || 8080; // Use specified port or default to 8080

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
