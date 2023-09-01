import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAQLJxggMA9eJPt9gv-HpH7C7zxAJelW1E",
  authDomain: "reactjs-blog-a8f67.firebaseapp.com",
  projectId: "reactjs-blog-a8f67",
  storageBucket: "reactjs-blog-a8f67.appspot.com",
  messagingSenderId: "310182173400",
  appId: "1:310182173400:web:983924277b2d67c293d5ad",
  measurementId: "G-C9QS406KFD"
};

const app = initializeApp(firebaseConfig);
export default app;