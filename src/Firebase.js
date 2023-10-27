// Import required functions from the Firebase modules
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
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc } from "firebase/firestore";
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

// Sign in with Google account
// This function uses Firebase's signInWithPopup method to authenticate the user with Google
// If the user is new, it adds their information to the Firestore database
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;

    // Check if the user already exists in the Firestore database
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);

    // If the user is new, add their information to the Firestore database
    if (docs.docs.length === 0) {

      const newUser = {
        uid: user.uid,
        name: user.displayName,
        nickname: user.displayName,
        bio: "",
        authProvider: "google",
        email: user.email,
        profilePhotoUrl: user.photoURL
      };

      /*await addDoc(collection(db, "users"), newUser);
      */
     //firebase.firestore().collection("colName").doc("docID").set({...})

      if (user) {
      const docRef = collection(db, "users");
      await setDoc(doc(docRef, user.uid), newUser);
    };
      

    }
    // If error occurs then, catch error and display the error message
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

      // If user provides profile picture then the picture will be uploaded to Firebase storage
      //if (profilePicture) {
         //Upload profile picture to storage
       // const storageRef = ref(storage, `profilePictures/${user.uid}`);
        //await uploadBytes(storageRef, profilePicture);
  
        // Get the download URL of the uploaded image
        //const downloadURL = await getDownloadURL(storageRef);
        //await addDoc(collection(db, "users"), {
        //  profilePhotoUrl: downloadURL,});
      //}

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, profilePicture);
      const downloadURL = await getDownloadURL(storageRef);
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        nickname: name,
        bio: "",
        authProvider: "local",
        email,
        profilePhotoUrl: downloadURL,
      });
      

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
    storage,
    app,
  };