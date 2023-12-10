import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../Firebase";
import "./Input.css";
import { setDoc, doc, collection, addDoc } from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Input = ({ selectedChat }) => {
  const [user] = useAuthState(auth);
  const [text, setText] = useState("");
  const [mediaToggle, setMediaToggle] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [img, setImg] = useState(null);
  const [vid, setVid] = useState(null);
  const [aud, setAud] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (mediaType !== "") {
      if (mediaType === "img" && (img === null || img === undefined)) {
        setMediaType("");
      };
      if (mediaType === "vid" && (vid === null || vid === undefined)) {
        setMediaType("");
      };
      if (mediaType === "aud" && (aud === null || aud === undefined)) {
        setMediaType("");
      };
    };
    handleSubmit();
    setText("");
    setMediaToggle(false);
    setMediaType("");
  };

  const handleSubmit = async () => {
    if (text.trim() !== "" && selectedChat !== "") {
      if (selectedChat === "public") {
        if (mediaType === "img") {
          const imgID = user.uid + Math.random().toString(36).slice(0, 5);
          const storageRef = ref(storage, `images/${imgID}`);
          await uploadBytes(storageRef, img);
          var imgUrl = await getDownloadURL(ref(storage, `images/${imgID}`)); //var keyword used for accessibility outside of statement
        };
        if (mediaType === "vid") {
          const vidID = user.uid + Math.random().toString(36).slice(0, 5);
          const storageRef = ref(storage, `videos/${vidID}`);
          await uploadBytes(storageRef, vid);
          var vidUrl = await getDownloadURL(ref(storage, `videos/${vidID}`)); //var keyword used for accessibility outside of statement
        };
        if (mediaType === "aud") {
          const audID = user.uid + Math.random().toString(36).slice(0, 5);
          const storageRef = ref(storage, `audio/${audID}`);
          await uploadBytes(storageRef, aud);
          var audUrl = await getDownloadURL(ref(storage, `audio/${audID}`)); //var keyword used for accessibility outside of statement
        };
        await addDoc(collection(db, "publicChat"), {
          text,
          idSender: user.uid,
          isMedia: mediaType === "" ? false : true,
          timeSent: new Date(),
          imgUrl: mediaType === "img" ? imgUrl : null,
          vidUrl: mediaType === "vid" ? vidUrl : null,
          audUrl: mediaType === "aud" ? audUrl : null,
        });
      } else if (typeof selectedChat === "string") {
        const messageID = user.uid + selectedChat + Math.random().toString(36).slice(0, 5);
        const docRef = collection(db, "messages");
        await setDoc(doc(docRef, messageID), {
          text,
          idSender: user.uid,
          idReciever: selectedChat,
          mid: messageID,
          isMedia: mediaType === "" ? false : true,
          timeSent: new Date(),
        });
      }
    }
  };

  const pickImage = () => {
    setMediaType("img")
  };
  const pickVideo = () => {
    setMediaType("vid")
  };
  const pickAudio = () => {
    setMediaType("aud")
  };

  const submitMedia = (event) => {
    if (mediaType !== "") {
      const file = event.target.files[0];
      if (mediaType === "img") {
        setImg(file);
        setVid(null);
        setAud(null);
      } else if (mediaType === "vid") {
        setVid(file);
        setImg(null);
        setAud(null);
      } else if (mediaType === "aud") {
        setAud(file);
        setImg(null);
        setVid(null);
      };
    };
  };

  const toggleMedia = () => {
    setMediaToggle(!mediaToggle);
    setMediaType("");
    setImg(null);
    setVid(null);
    setAud(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  useEffect(() => {
    setText("");
    setMediaToggle("false")
    setMediaType("")
  }, [selectedChat]);

  const ImgSvg = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12" />
      </svg>
    )
  };

  const VidSvg = () => {
    return (<svg className="svg-vid" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
      </svg>)
  };

  const AudSvg = () => {
    return (<svg className="svg-aud" xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5" />
      </svg>)
  };

  const PaperclipSvg = () => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-paperclip" viewBox="0 0 16 16">
      <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z" />
    </svg>)
  };

  return (
    <form onSubmit={onSubmit}>
      {mediaToggle === true ? <div className="media-container">
        {mediaType !== "" ? 
        <input className="media-hidden-input" type="file" id="file-input" accept={mediaType === "img" ?
         "image/*" :
          mediaType === "vid" ?
          "video/*" :
           "audio/*"} onChange={submitMedia} /> : null}
        {(img !== null || vid !== null || aud !== null) ? (
          <div className="selected-media">
          {mediaType === "img" && img !== null ? (
            <>
              <img src={URL.createObjectURL(img)} alt="Selected Image" className="selected-image" />
              <p className="file-name">{img.name}</p>
            </>
          ) : mediaType === "vid" && vid !== null ? (
            <>
              <video src={URL.createObjectURL(vid)} alt="Selected Video" className="selected-video" controls style={{ width: '100%' }} />
              <p className="file-name">{vid.name}</p>
            </>
          ) : mediaType === "aud" && aud !== null ? (
            <>
              <audio src={URL.createObjectURL(aud)} alt="Selected Audio" className="selected-audio" controls style={{ width: '100%' }} />
              <p className="file-name">{aud.name}</p>
            </>
          ) : null}
        </div>
        
        ) : null}
        <label htmlFor="file-input">
          {mediaType === "" ? 
          <div className="inner-media-container">
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
            </div></div> : null}
        </label>
      </div> : null}
      <div className="input__container">
        <textarea
          className="input_box"
          type="text"
          placeholder="Message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKey}
        />
        <div className="paperclip-container" onClick={toggleMedia} >
        <PaperclipSvg />
        </div>
        <div className="btn-container">
          <button className="send-btn" type="submit">
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default Input;
