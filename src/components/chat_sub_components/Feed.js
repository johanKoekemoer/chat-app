import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, orderBy, query, where, and, or } from "firebase/firestore";
import { auth, db } from "../../Firebase";
import "./Feed.css";

const Feed = ({ selectedChat, feedRef, userData, messages }) => {

  const [user] = useAuthState(auth);
  const [publicChat, setPublicChat] = useState([]);

  const fetchPublic = () => {
    if (user) {
      const q = query(collection(db, "publicChat"), orderBy("timeSent"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageArray = snapshot.docs.map((doc) => doc.data());
        setPublicChat(messageArray);
      }, (error) => {
        console.error("Error fetching messages: ", error);
      });
      return unsubscribe;
    }
  };

  const scrollDown = () => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    };
  };

  useEffect(() => {
    scrollDown();
  }, [publicChat, messages])

  useEffect(() => {
    const fetchData = async () => {
      if (selectedChat === "public") fetchPublic();
      scrollDown();
    };
    fetchData();
  }, [selectedChat]);

  function PublicDisplay() {
    return (
      <div className="feed-inner-container">
        {publicChat.map((msg, index) => (
          <div key={index} className={msg.idSender === user.uid ? 'container-right' : 'container-left'}>
            <div className={msg.idSender === user.uid ? 'bubble-right' : 'bubble-left'}>
              {msg.imgUrl ?
                <img
                  className="feed-img"
                  src={msg.imgUrl}
                  alt="image"
                /> :
                msg.vidUrl ?
                  <video
                    className="feed-video"
                    src={msg.vidUrl}
                    alt="video"
                    controls
                    style={{ width: '100%' }}
                    height="300"
                  /> :
                  msg.audUrl &&
                  <audio
                    className="feed-audio"
                    src={msg.audUrl}
                    alt="audio"
                    controls
                    style={{ width: '100%' }}
                  />
              }
              {msg.idSender !== user.uid ? <div className="name-container"><p className="name-tag">{userData[msg.idSender].displayName}</p></div> : null}
              <div className="message-container">
                <p className="message-tag">{msg.text}</p>
              </div>
              <div className="time-container">
                <p className="time-tag">{new Date(msg.timeSent.seconds * 1000).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  function PrivateDisplay() {
    return (
      <div className="feed-inner-container">
        {messages.filter((msg) => ((msg.idSender === selectedChat)||(msg.idReciever === selectedChat)))
        .map((msg, index) => (
          <div key={index} className={msg.idSender === user.uid ? 'container-right' : 'container-left'}>
            <div className={msg.idSender === user.uid ? 'bubble-right' : 'bubble-left'}>
              {msg.imgUrl ?
                <img
                  className="feed-img"
                  src={msg.imgUrl}
                  alt="image"
                /> :
                msg.vidUrl ?
                  <video
                    className="feed-video"
                    src={msg.vidUrl}
                    alt="video"
                    controls
                    style={{ width: '100%' }}
                    height="300"
                  /> :
                  msg.audUrl &&
                  <audio
                    className="feed-audio"
                    src={msg.audUrl}
                    alt="audio"
                    controls
                    style={{ width: '100%' }}
                  />
              }
              <div className="message-container">
                <p className="message-tag">{msg.text}</p>
              </div>
              <div className="time-container">
                <p className="time-tag">{new Date(msg.timeSent.seconds * 1000).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (selectedChat === "public") {
    return (
      <div>
        <PublicDisplay />
      </div>
    )
  } else if (selectedChat === "") {
    return (
      <div>
        <h3>Welcome to Fireplace Messenger</h3>
        <h4>Please select a Chat from the Lobby on the right</h4>
      </div>
    )
  } else return (
    <div>
      <PrivateDisplay />
    </div>

  )
};
export default Feed;