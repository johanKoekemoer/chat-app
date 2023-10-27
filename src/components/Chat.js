
// Import the necessary react hooks, navigation functions, styling and Firebase funtions
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Chat.css";
import { auth } from "../Firebase"
import Feed from "./chat_sub_components/Feed";
import Input from "./chat_sub_components/Input";
import Lobby from "./chat_sub_components/Lobby";
import Topbar from "./chat_sub_components/Topbar";


function Chat() {

  //Declare neccesary state variables
  const [user, loading] = useAuthState(auth);


  useEffect(() => {
    //Insert useEffect if neccesary
  }, [user, loading]);

  return (
    <div className="chat">
      <div className="topbar-container">
      <Topbar />
      </div>
      <div className="main-container">
        <div className="left-container">
          <div className="feed-container">
            <Feed />
          </div>
          <div className="input-container">
            <Input />
          </div>
        </div>
        <div className="lobby-container">
          <Lobby />
        </div>
      </div>
    </div>
  );
  
  

}

export default Chat;
