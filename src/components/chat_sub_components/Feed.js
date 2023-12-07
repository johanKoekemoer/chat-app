import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, onSnapshot, orderBy, query, where, and, or } from "firebase/firestore";
import { auth, db } from "../../Firebase";
import "./Feed.css";

const Feed = ({ selectedChat, feedRef }) => {

  // Declare State variables:
  const [user] = useAuthState(auth);
  const [usernames, setUsernames] = useState({});
  const [messages, setMessages] = useState([]);
  const [publicChat, setPublicChat] = useState([]);



  const fetchUsernames = async () => {
  // Change to run on new user
    const q = query(collection(db, "users"));
    try {
      const snapshot = await getDocs(q);
      const userDoc = snapshot.docs;
      const userObject = {};
      for (let i = 0; i < userDoc.length; i++) {
        let uid = userDoc[i].data().uid;
        let name = userDoc[i].data().name;
        userObject[uid] = name
      };
      setUsernames(userObject);
    } catch (error) {
      console.error("Error fetching usernames: ", error);
    };
  };

  //fetchUsernames()

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



  const fetchMessages = async () => {
    if (user) {
      const docref = collection(db, "messages");
      const q = query(docref, or(
        and(where("idSender", "==", user.uid), where("idReciever", "==", selectedChat)),
        and(where("idSender", "==", selectedChat), where("idReciever", "==", user.uid))));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messageArray = snapshot.docs.map((doc) => doc.data());
        const sortedMsgs = messageArray.sort((a, b) => a.timeSent - b.timeSent)
        setMessages(sortedMsgs);

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
    fetchUsernames();
    if (selectedChat === "public") {
      fetchPublic();
  } else if (selectedChat != "public" && selectedChat.length >= 1) {
    fetchMessages();
  };
  }, [selectedChat]);

  useEffect(() => {
scrollDown();
  }, [messages, publicChat]);

  function PublicDisplay() {
    return (
      <div className="feed-inner-container">
        {publicChat.map((msg, index) => (
          <div key={index} className={msg.idSender === user.uid ? 'container-right' : 'container-left'}>
            <div className={msg.idSender === user.uid ? 'bubble-right' : 'bubble-left'}>

              {msg.idSender !== user.uid ? <div className="name-container"><p className="name-tag">{usernames[msg.idSender]}</p></div> : null}
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
        {messages.map((msg, index) => (
          <div key={index} className={msg.idSender === user.uid ? 'container-right' : 'container-left'}>
            <div className={msg.idSender === user.uid ? 'bubble-right' : 'bubble-left'}>
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
        <p>...No Chat Selected...</p>
      </div>
    )
  } else return (
    <div>
      <PrivateDisplay />
    </div>

  )

};

export default Feed;