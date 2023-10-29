import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "../Firebase";
import { doc, onSnapshot } from "firebase/firestore";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user === null || user === undefined) return navigate("/");

    const userDocRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserData(userData);
      } else {
        // Handle the case where the user document doesn't exist
        // This means there's no data for the user in the "users" collection
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, loading, navigate]);

  if (loading) {
    return <div><h3>Loading...</h3></div>;
  }

  function profile() {
    navigate("/profile");
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as
        <div>{userData ? userData.name : ""}</div>
        <div>{userData ? userData.email : ""}</div>
        <button className="dashboard__btn" onClick={logout}>
          Logout
        </button>
        <button className="profile__btn" onClick={profile}>
          Continue to Profile
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
