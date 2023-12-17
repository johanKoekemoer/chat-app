import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, logout } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "./Topbar.css";

const Topbar = ({ selectedChat, userData, fetchUserData }) => {

  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData[user?.uid] === undefined || userData[user?.uid] === null) {
      fetchUserData();
    };
  }, []);

  const LogoutSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="lougout-svg" viewBox="0 0 16 16">
        <path d="M7.5 1v7h1V1z" />
        <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812" />
      </svg>
    )
  };

  const handleLogout = async () => {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { online: false });
    await logout();
    navigate('/');
  };

  return (
    <div className="topbar" >
      <div className="chat-title-container">
        {selectedChat === "" ?
          null : selectedChat === "public" ?
            (<img className="chat-picture"
              src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/Fireplace_logo.png?alt=media&token=b8ad67ed-4fee-4b44-8725-fabef8a5a9cc"
              alt="Firebase logo" />) :
            (<img className="chat-picture"
              src={userData[selectedChat]?.profilePhotoUrl}
              alt={userData[selectedChat]?.displayName + "'s picture"} />)}
        <p className="chat-name">{selectedChat === "" ? null : selectedChat === "public" ? "Fireplace Chatroom" : (userData[selectedChat]?.displayName)}</p>
        <p className="chat-bio">{selectedChat === "" ? null : selectedChat === "public" ? null : (" - \"" + userData[selectedChat]?.bio + "\"")}</p>
      </div>
      <div className="profile-logout-outer-container">
        <div className="your-profile-container" onClick={() => navigate("/profile")}>
          <img className="chat-picture" src={userData[user?.uid]?.profilePhotoUrl} />
          <p className="chat-name">Your Profile</p>
        </div>

        <div className="logout-container"
          onClick={handleLogout}>
          <LogoutSvg />
        </div>
      </div>
    </div >
  )
};

export default Topbar;
