import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBcVUIMEeHo7uJcE8UvOwq8Dzz-iE4grk4",
    authDomain: "pricelist-boulvandre.firebaseapp.com",
    databaseURL: "https://pricelist-boulvandre-default-rtdb.firebaseio.com",
    projectId: "pricelist-boulvandre",
    storageBucket: "pricelist-boulvandre.appspot.com",
    messagingSenderId: "137243822858",
    appId: "1:137243822858:web:9ae1e2ded5ca6322e788f3"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

const fire = firebase;
export default fire;