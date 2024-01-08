import React, { useState, useRef, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Chat.css";
import { auth, db } from "../Firebase"
import { collection, onSnapshot, query, where, or } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Feed from "./chat_sub_components/Feed";
import Input from "./chat_sub_components/Input";
import Lobby from "./chat_sub_components/Lobby";
import Topbar from "./chat_sub_components/Topbar";

function Chat({ userData, fetchUserData }) {

  const feedRef = useRef(null);

  const [user, loading] = useAuthState(auth);
  const [selectedChat, setSelectedChat] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (user) {
      const docref = collection(db, "messages");
      const q = query(docref, or(
        where("idSender", "==", user.uid),
        where("idReciever", "==", user.uid)
      ));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageArray = snapshot.docs.map((doc) => doc.data());
        const sortedMsgs = messageArray.sort((a, b) => a.timeSent - b.timeSent);
        setMessages(sortedMsgs);
      }, (error) => {
        console.error("Error fetching messages: ", error);
      });
  
      return unsubscribe
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const navigate = useNavigate();

  if (!user && !loading) {
    navigate('/');
  };

  const updateChat = (chat) => {
    setSelectedChat(chat);
  }

  return (
    <div className="chat">
      <div className="topbar-container">
        <Topbar selectedChat={selectedChat} userData={userData} fetchUserData={fetchUserData} />
      </div>
      <div className="main-container">
        <div className={selectedChat === "" ? "left-container-nochat" : "left-container"}>
          <div className={selectedChat === "" ? "feed-container-nochat" : "feed-container"} ref={feedRef}>
            <Feed selectedChat={selectedChat} feedRef={feedRef} userData={userData} messages={messages} />
          </div>
          <div className={selectedChat === "" ? "input-container-nochat" : "input-container"}>
            <Input selectedChat={selectedChat} />
          </div>
        </div>
        <div className="lobby-container">
          <Lobby updateChat={updateChat} selectedChat={selectedChat} userData={userData} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
