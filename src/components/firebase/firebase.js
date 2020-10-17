import app from "firebase/app";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBGT79ox9Dh1uksG1nbiORofAYBXOat4_s",
  authDomain: "qr-code-b0dc9.firebaseapp.com",
  databaseURL: "https://qr-code-b0dc9.firebaseio.com",
  projectId: "qr-code-b0dc9",
  storageBucket: "qr-code-b0dc9.appspot.com",
  messagingSenderId: "557480970352",
  appId: "1:557480970352:web:b3e689d8e69ba5592eccb5",
  measurementId: "G-1SXZMVSBCB"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  getUser = () => {
    return this.auth.currentUser;
  };

  doSendVerificationEmail = () => this.auth.currentUser.sendEmailVerification();

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
