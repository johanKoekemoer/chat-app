
// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Chat.css";
import { auth } from "../Firebase"
import Feed from "./chat_sub_components/Feed";
import Input from "./chat_sub_components/Input";
import Lobby from "./chat_sub_components/Lobby";
import Topbar from "./chat_sub_components/Topbar";


function Chat() {

  const feedRef = useRef(null);

  //Declare neccesary state variables
  const [user, loading] = useAuthState(auth);
  const [selectedChat, setSelectedChat] = useState("")

  const updateChat = (chat) => {
    setSelectedChat(chat);
  }


  return (
    <div className="chat">
      <div className="topbar-container">
        <Topbar selectedChat={selectedChat}/>
      </div>
      <div className="main-container">
        <div className="left-container">
          <div className="feed-container" ref={feedRef}>
            <Feed selectedChat={selectedChat} feedRef={feedRef} />
          </div>
          <div className="input-container">
            <Input selectedChat={selectedChat} />
          </div>
        </div>
        <div className="lobby-container">
          <Lobby updateChat={updateChat} selectedChat={selectedChat} />
        </div>
      </div>
    </div>
  );



}

export default Chat;
