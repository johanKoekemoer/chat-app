import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase";
import "./Input.css";
import { setDoc, doc, collection, addDoc } from "@firebase/firestore";

const Input = ({ selectedChat }) => {
  const [user] = useAuthState(auth);
  const [text, setText] = useState("");

  const onSubmit = async(event)=> {
    event.preventDefault();
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (text.trim() !== "") {
      if (selectedChat === "public") {
        await addDoc(collection(db, "publicChat"), {
          text,
          idSender: user.uid,
          isMedia: false,
          timeSent: new Date(),
        });
      } else if (typeof selectedChat === "string") {
        const messageID = user.uid + selectedChat + Math.random().toString(36).slice(0, 5);
        const docRef = collection(db, "messages");
        await setDoc(doc(docRef, messageID), {
          text,
          idSender: user.uid,
          idReciever: selectedChat,
          mid: messageID,
          isMedia: false,
          timeSent: new Date(),
        });
      }
      setText("");
    }
  };

  const handleKey = (e)=> {
   if(e.key ==="Enter") {
    handleSubmit();
  }
  };

  useEffect(() => {
    setText("");
  }, [selectedChat]);

  return (
    <form onSubmit={onSubmit}>
      <div className="input__container">
        <textarea
          className="input_box"
          type="text"
          placeholder="Message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKey}
        />
        <div className="btn-container">
          <button className="send-btn" type="submit">
            Send
          </button>
        </div>
      </div>
    </form>
  /*
  //event:
const micButtonClicked = () => {

    //check the access:
    isMicrophoneAllowed(isAllowed => {
        if(isAllowed)
            record();
        else
            navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => record())
            .catch(err => alert('need permission to use microphone'));
    });
}

//isMicrophoneAllowed:
const isMicrophoneAllowed = callback => {
    navigator.permissions.query({name: 'microphone'})
    .then(permissionStatus => Strings.runCB(callback, permissionStatus.state === 'granted'));
}

//record:
const record = () => {
    // start recording...
}
  */

  );
};

export default Input;
