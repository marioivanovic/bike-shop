import admin from 'firebase-admin';
import serviceAccount from './firebaseConfig.js';

const serviceAccount = JSON.parse(
    fs.readFileSync(new URL('./firebaseConfig.json', import.meta.url))
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { db };

