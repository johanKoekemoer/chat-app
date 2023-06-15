import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyB7Fv8CNI49N16PaY6T3F9ji30ABtA3xPU",
    authDomain: "fireplace-7d903.firebaseapp.com",
    projectId: "fireplace-7d903",
    storageBucket: "fireplace-7d903.appspot.com",
    messagingSenderId: "367195049281",
    appId: "1:367195049281:web:71175456956fff9ab765c0",
    measurementId: "G-WBYVPYK5H0"
  };

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  
  export {db}