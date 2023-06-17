// Imports required from Firebase:
import { initializeApp } from "firebase/app";

// Import required functions from firebase authentication 
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  } from "firebase/auth";

  // Import required functions from firebase firestore
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  } from "firebase/firestore";

  // Import required functions from firebase storage
  import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
  } from "firebase/storage";

  //Firebase configuration required for initialization
const firebaseConfig = {
  apiKey: "AIzaSyB7Fv8CNI49N16PaY6T3F9ji30ABtA3xPU",
  authDomain: "fireplace-7d903.firebaseapp.com",
  projectId: "fireplace-7d903",
  storageBucket: "fireplace-7d903.appspot.com",
  messagingSenderId: "367195049281",
  appId: "1:367195049281:web:71175456956fff9ab765c0",
  measurementId: "G-WBYVPYK5H0"
};

// Initialize the Firebase application, authentication, database and storage.
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Authentication
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        profilePhotoUrl: user.photoURL
      });
    }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Email and password Authentication: Log in
  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Email and password Authentication: Register
  const registerWithEmailAndPassword = async (name, email, password, profilePicture) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const userData = {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      };
  
      if (profilePicture) {
        // Upload profile picture to storage
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
  
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        userData.profilePhotoUrl = downloadURL;
      }
  
      await addDoc(collection(db, "users"), userData);
    } catch (err) {
      console.error(err);
      alert(err.message);
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
  const logout = () => {
    signOut(auth);
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
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
  };