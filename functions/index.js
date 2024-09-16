const functions = require("firebase-functions");
const next = require("next");

const dev = process.env.NODE_ENV !== "production"; // Detect if it's in dev mode
const nextApp = next({dev}); // Initialize Next.js app based on environment
const handle = nextApp.getRequestHandler();

// Ensure Next.js is prepared before handling any requests
exports.nextjsFunction = functions.https.onRequest((req, res) => {
  return nextApp.prepare().then(() => handle(req, res));
});
