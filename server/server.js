
// const functions = require('firebase-functions');
// const React = require('react');
// const ReactDOMServer = require('react-dom/server');
// const { StaticRouter } = require('react-router-dom/server');
// const App = require('./src/App').default; // Adjust the path to your App component
// const { pipeToNodeWritable } = require('react-dom/server');
// const { Readable } = require('stream');

// exports.ssrApp = functions.https.onRequest((req, res) => {
//   const entryPoint = ['/main.js'];

//   const context = {};
//   const appStream = ReactDOMServer.renderToPipeableStream(
//     <StaticRouter location={req.url} context={context}>
//       <App />
//     </StaticRouter>,
//     {
//       bootstrapScripts: entryPoint,
//       onEnd() {
//         res.end();
//       },
//     }
//   );

//   const appPromise = new Promise((resolve, reject) => {
//     const stream = new Readable();
//     pipeToNodeWritable(appStream, stream, { onFinish: resolve, onError: reject });
//     stream.push(null); // Signal the end of the stream
//   });

//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');

//   appPromise
//     .then(() => {
//       res.end();
//     })
//     .catch((error) => {
//       console.error('Error rendering React app:', error);
//       res.statusCode = 500;
//       res.end('<!doctype html><p>Loading...</p>');
//     });
// });
