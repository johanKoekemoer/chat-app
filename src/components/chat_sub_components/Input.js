import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase";
import "./Input.css";
import { setDoc, doc, collection, addDoc } from "@firebase/firestore";

const Input = ({ selectedChat }) => {
  const [user] = useAuthState(auth);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(false);
  const [submitPrompt, setSubmitPrompt] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (text.trim() !== "" && selectedChat !== "") {
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

  const pickImage = () => {
    setSubmitPrompt("img")
  };

  const pickVideo = () => {
    setSubmitPrompt("vid")
  };

  const pickAudio = () => {
    setSubmitPrompt("aud")
  };
  
  const submitImage = () => {
    //
  };

  const submitVideo = () => {
    //
  };

  const submitAudio = () => {
    //
  };

  const promptMediaShare = () => {
    setPrompt(!prompt);
    setSubmitPrompt("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    setText("");
    setPrompt("false")
  }, [selectedChat]);

  const ImgSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
      </svg>
    )
  };

  const VidSvg = () => {
    return (
      <svg className="svg-vid" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
        <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
      </svg>
    )
  };

  const AudSvg = () => {
    return (
      <svg className="svg-aud" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-headphones" viewBox="0 0 16 16">
        <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5" />
      </svg>
    )
  };


  return (
    <form onSubmit={onSubmit}>
      {prompt === true ? <div className="media-container">
        {submitPrompt !== "" ? <input type="file" id="file-input" accept={submitPrompt === "img" ? "image/*" : submitPrompt === "vid" ? "video/*" : "audio/*"} onChange={submitImage} /> : <></>}
        {submitPrompt === "" ? <>
          <div className="img-div" onClick={pickImage}>
            <ImgSvg />
            <p className="par-img">Image</p>
          </div>
          <div className="vid-div" onClick={pickVideo}>
            <VidSvg />
            <p className="par-vid">Video</p>
          </div>
          <div className="aud-div" onClick={pickAudio}>
            <AudSvg />
            <p className="par-aud">Audio</p>
          </div></> : <></>}
      </div> : <></>}
      <div className="input__container">
        <textarea
          className="input_box"
          type="text"
          placeholder="Message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKey}
        />
        <div className="paperclip-container">
          <svg
            className="paperclip"
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            fill="currentColor"
            class="bi bi-paperclip"
            viewBox="0 0 16 16"
            onClick={promptMediaShare}
          >
            <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
          </svg></div>
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
          if (isAllowed)
            record();
          else
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => record())
              .catch(err => alert('need permission to use microphone'));
        });
  }

  //isMicrophoneAllowed:
  const isMicrophoneAllowed = callback => {
        navigator.permissions.query({ name: 'microphone' })
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
