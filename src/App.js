// Import routing elements and components
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import { auth, db, logout } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateDoc, doc, collection, onSnapshot } from "@firebase/firestore";

function App() {

  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({});

  const fetchUserData = () => {
    const q = collection(db, "users");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userObject = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        userObject[uid] = {
          uid: data.uid,
          name: data.name,
          displayName: data.displayName,
          bio: data.bio,
          profilePhotoUrl: data.profilePhotoUrl,
          online: data.online,
          email: data.email,
        };
      });
      setUserData(userObject);
    });
    return unsubscribe;
  };


  useEffect(() => {
    const unsubscribe = fetchUserData();
    return () => unsubscribe();
  }, []);

  // UseEffect for if user leaves without logging out:
  useEffect(() => {
    const handleUnload = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { online: false });
        await logout();
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user]);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/profile" element={<Profile userData = {userData} />} />
          <Route exact path="/chat" element={<Chat userData = {userData} fetchUserData = {fetchUserData} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
