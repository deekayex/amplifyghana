const functions = require("firebase-functions");
const next = require("next");
const cors = require("cors")({origin: true}); // CORS middleware

const dev = process.env.NODE_ENV !== "production"; // Detect if it's in dev mode
const nextApp = next({dev}); // Initialize Next.js app based on environment
const handle = nextApp.getRequestHandler();

// Ensure Next.js is prepared before handling any requests and apply CORS
exports.nextjsFunction = functions.https.onRequest((req, res) => {
  return nextApp.prepare().then(() => {
    // Apply CORS middleware before handling the request
    cors(req, res, () => {
      return handle(req, res); // Handle the request with Next.js
    });
  });
});
