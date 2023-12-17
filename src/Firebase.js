import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { getFirestore, getDoc, collection, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Fv8CNI49N16PaY6T3F9ji30ABtA3xPU",
  authDomain: "fireplace-7d903.firebaseapp.com",
  projectId: "fireplace-7d903",
  storageBucket: "fireplace-7d903.appspot.com",
  messagingSenderId: "367195049281",
  appId: "1:367195049281:web:71175456956fff9ab765c0",
  measurementId: "G-WBYVPYK5H0"
};

// Initialize the Firebase application, authentication, database and storage
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Authentication
const googleProvider = new GoogleAuthProvider();

// Sign in or Register with Google account:
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Check if the user already exists in the Firestore database
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // If the user is new, add their information to the Firestore database
      if (!userDocSnapshot.exists()) {
        const newUser = {
          uid: user.uid,
          name: user.displayName,
          displayName: user.displayName.split(" ")[0],
          bio: "Hey there! I am using Fireplace.",
          authProvider: "Google",
          email: user.email,
          profilePhotoUrl: user.photoURL,
          online: true,
        };
        const docRef = collection(db, "users");
        await setDoc(doc(docRef, user.uid), newUser);
      }
    };
  } catch (err) {
    console.error(err);
    alert("Google login error, please confirm that your Google credentials are correct. See console for additional error information.");
  }
};

// Email and password Authentication: Log in
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert("Login error, please check email and password. If the problem persists, see console for additional error information.");
  }
};

// Email and password Authentication: Register
const registerWithEmailAndPassword = async (name, email, password, profilePicture) => {
  try {
    // If user provides profile picture then the picture will be uploaded to Firebase storage
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, profilePicture);
    const downloadURL = await getDownloadURL(storageRef);
    const newUser = {
          uid: user.uid,
          name,
          displayName: name.split(" ")[0],
          bio: "Hey there! I am using Fireplace.",
          authProvider: "Local",
          email,
          profilePhotoUrl: downloadURL,
          online: true,
    };
    const docRef = collection(db, "users");
    await setDoc(doc(docRef, user.uid), newUser);
  } catch (err) {
    console.error(err);
    alert("Error with non-Google registration: " + err);
  }
};

// Password reset function
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout function
const logout = async () => {
  await signOut(auth);
};

// Export all the necessary functions
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  storage,
  app,
};