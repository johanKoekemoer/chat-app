import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { query, collection, getDocs } from "firebase/firestore";
import "./Topbar.css";

const Topbar = ({ selectedChat }) => {

  const [data, setData] = useState({});

  const fetchData = async () => {
    const q = query(collection(db, "users"));
    try {
      const snapshot = await getDocs(q);
      const userDoc = snapshot.docs;
      const userObject = {};
      for (let i = 0; i < userDoc.length; i++) {
        let uid = userDoc[i].data().uid;
        let name = userDoc[i].data().displayName;
        let picUrl = userDoc[i].data().profilePhotoUrl;
        let bio = userDoc[i].data().bio;
        userObject[uid] = {
          name: name,
          picUrl: picUrl,
          bio: bio,
        }
      };
      setData(userObject);
    } catch (error) {
      console.error("Error fetching usernames: ", error);
    };
  };

  useEffect(() => {
    fetchData();
  }, [selectedChat]);

  if (selectedChat === "public") {
    return (
      <div className="topbar" >
        <div className="chat-title-container">
          <img className="chat-picture" src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/Fireplace_logo.png?alt=media&token=b8ad67ed-4fee-4b44-8725-fabef8a5a9cc" alt="Firebase logo" />
          <p className="chat-name">Fireplace Chat</p>
        </div>
      </div >
    )

  } else if (selectedChat !== "" && selectedChat !== "public") {
    return (
      <div className="topbar" >
        <div className="chat-title-container">
          <img className="chat-picture" src={data[selectedChat]?.picUrl} alt={data[selectedChat]?.name + "'s picture"} />
          <p className="chat-name">{data[selectedChat]?.name}</p>
          <p className="chat-bio">{" - \"" + data[selectedChat]?.bio + "\""}</p>
        </div>
        <div className="your-profile-container">
        </div>
      </div >
    )
  };

}

export default Topbar;
