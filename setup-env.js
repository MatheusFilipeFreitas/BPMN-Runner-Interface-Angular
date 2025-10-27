// setup-env.js
const fs = require('fs');
const path = require('path');

const env = {
  production: true,
  API_PATH: process.env.API_PATH,
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  dev_api_key: null
};

const envFileContent = `export const environment = ${JSON.stringify(env, null, 2)};\n`;

fs.writeFileSync(
  path.join(__dirname, 'src/environments/environments.prod.ts'),
  envFileContent
);

console.log('environment.prod.ts generated successfully.');
