// makeUserAdmin.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.makeUserAdmin = functions.https.onRequest(async (request, response) => {
  try {
    const { uid } = request.body;

    if (!uid) {
      throw new Error('UID is required.');
    }

    // Set the custom claim for the user as an admin
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    response.status(200).send('User is now an admin.');
  } catch (error) {
    console.error('Error making user admin:', error);
    response.status(500).send('Internal Server Error');
  }
});
