import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyAqebA0e5l-xgcEVvNsPypJ1_dRi2dHqMk",
  authDomain: "e-commerce-1-b4d7f.firebaseapp.com",
  databaseURL: "https://e-commerce-1-b4d7f.firebaseio.com",
  projectId: "e-commerce-1-b4d7f",
  storageBucket: "e-commerce-1-b4d7f.appspot.com",
  messagingSenderId: "368342962904",
  appId: "1:368342962904:web:43a406717179b3253ebdad",
  measurementId: "G-08WBSCBEDH"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  getUser = () =>
  {return this.auth.currentUser};

  doSendVerificationEmail = () => 
    this.auth.currentUser.sendEmailVerification();

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
 
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
    
}

export default Firebase;