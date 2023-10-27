// Import routing elements and components
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import { auth, db } from "./Firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc } from "@firebase/firestore";

//Main App Component
function App() {

  const [user, loading] = useAuthState(auth)
  const [id, setId] = useState("")
  const setUserOnline = async (id) => {
    if (id != "") {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, { status: true });
    }
  };

  const setUserOffline = async (id) => {
    if (id != "") {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, { status: false });
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault(); // Prevent the default dialog from showing
      setUserOffline(id); // Update the user's status to "false" when leaving
    };

    // Attach the beforeunload event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, now you can access user.uid
        setId(user.uid);
        setUserOnline(id); // Update the user's status to "true" when they log in
      } else {
        setUserOffline(id); // Update the user's status to "false" when they log out
      }
    });

    return () => {
      // Remove the beforeunload event listener when the component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [id, user, loading]);


  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;