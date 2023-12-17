import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase";
import "./Lobby.css";
import { collection, query, where, onSnapshot, or } from "@firebase/firestore";

const Lobby = ({ updateChat, selectedChat, userData }) => {

  const [user] = useAuthState(auth);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [history, setHistory] = useState([]);


  const fetchHistory = async () => {
    try {
      const docref = collection(db, "messages");
      const q = query(docref, or(
        where("idSender", "==", user.uid),
        where("idReciever", "==", user.uid)));

      const unsubscribe = onSnapshot(q, async (snapshot) => {

        const msgData = snapshot.docs.map((doc) => doc.data());
        msgData.sort((a, b) => a.timeSent - b.timeSent);

        let histData = [];
        for (let i = 0; i < msgData.length; i++) {
          const currentMsg = msgData[i];
          const senderOrReceiverUid = currentMsg.idReciever === user.uid ? currentMsg.idSender : currentMsg.idReciever;

          if (!histData.some((obj) => obj.uid === senderOrReceiverUid)) {
            histData.push({
              uid: senderOrReceiverUid,
              time: currentMsg.timeSent,
              text: currentMsg.text,
            });
          }
        }
        setHistory(histData);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching chat history: " + error);
    }
  };

  const getOnlineUsers = () => {
    const mapOnline = (userData) => {
      return Object.values(userData)
        .filter((userdata) => userdata.online).filter((userdata) => userdata.uid !== user.uid)
        .filter((userdata) => !history.some((item) => item.uid === userdata.uid) && userdata.uid !== user.uid)
        .map(({ uid, displayName, name, bio, profilePhotoUrl }) => ({
          uid,
          displayName,
          name,
          bio,
          profilePhotoUrl,
        }));
    };
    const usersOnline = mapOnline(userData);
    setOnlineUsers(usersOnline);
  };

  const getOfflineUsers = () => {
    const mapOffline = (userData) => {
      return Object.values(userData)
        .filter((userdata) => !userdata.online)
        .filter((userdata) => !history.some((item) => item.uid === userdata.uid) && userdata.uid !== user.uid)
        .map(({ uid, displayName, name, bio, profilePhotoUrl }) => ({
          uid,
          displayName,
          name,
          bio,
          profilePhotoUrl,
        }));
    };
    const usersOffline = mapOffline(userData);
    setOfflineUsers(usersOffline);
  };


  const handleClick = (uid) => {
    updateChat(uid);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const unsubscribeHistory = await fetchHistory();
        return () => {
          unsubscribeHistory();
        };
      }
    };
  
    fetchData().then(() => {
      getOnlineUsers();
      getOfflineUsers();
    });
  }, [userData, selectedChat]);
  

  const OnlineUserList = () => {
    const handleClick = (uid) => {
      updateChat(uid);
    };
    return (
      <div className="user-list">
        {onlineUsers
        .filter((userdata) => !history.some((item) => item.uid === userdata.uid))
          .map((person, index) => (
            <div
              key={index}
              className={selectedChat === person.uid ? "user-selected" : "user"}
              value={person.uid}
              onClick={() => handleClick(person.uid)}
            >
              <img
                className="img"
                src={userData[person.uid]?.profilePhotoUrl}
                alt={`${userData[person.uid]?.displayName}'s Profile`}
              />
              <p className="name">{userData[person.uid]?.displayName}</p>
            </div>
          ))}
      </div>
    );
  };

  const OfflineUserList = () => {
    const handleClick = (uid) => {
      updateChat(uid);
    };
    return (
      <div className="user-list">
        {offlineUsers
        .filter((userdata) => !history.some((item) => item.uid === userdata.uid))
          .map((person, index) => (
            <div
              key={index}
              className={selectedChat === person.uid ? "user-selected" : "user"}
              value={person.uid}
              onClick={() => handleClick(person.uid)}
            >
              <img
                className="img-offline"
                src={userData[person.uid]?.profilePhotoUrl}
                alt={`${userData[person.uid]?.displayName}'s Profile`}
              />
              <p className="name">{userData[person.uid]?.displayName}</p>
            </div>
          ))}
      </div>
    );
  }

  function ChatHistory() {
    const handleClick = (uid) => {
      updateChat(uid);
    };
    return (
      <div className="user-list">
        {history.map((person, index) => (
          <div
            key={index}
            className={selectedChat === person.uid ? "user-selected" : "user"}
            value={person.uid}
            onClick={() => handleClick(person.uid)}
          >
            <img
              className={`img ${userData[person.uid]?.online ? 'online' : 'offline'}`}
              src={userData[person.uid]?.profilePhotoUrl}
              alt={`${userData[person.uid]?.displayName}'s Profile`}
            />
            <p className="name">{userData[person.uid]?.displayName}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="public-list">
        <div className={selectedChat === "public" ? "public-inner-selected": "public-inner"}>
          <div className="fireplace" onClick={() => handleClick("public")}><img className="public-img" src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/Fireplace_logo.png?alt=media&token=b8ad67ed-4fee-4b44-8725-fabef8a5a9cc" alt="Firebase logo" /></div>
          <p className="name">Fireplace Chatroom</p>
        </div>
      </div>
      {history.length === 0 ? null :
        (<><div className="title-div">
          <p className="lobby-title">Chat History:</p>
        </div>
          <div className="chat-history">
            <ChatHistory />
          </div></>)}
      {onlineUsers.length === 0 ? null : (
        <><div className="title-div">
          <p className="lobby-title">Users Online:</p>
        </div>
          <div className="online-list">
            <OnlineUserList />
          </div></>)}
      {offlineUsers.length === 0 ? null :
        (<><div className="title-div">
          <p className="lobby-title">Users Offline:</p>
        </div>
          <div className="online-list">
            <OfflineUserList />
          </div></>)}
    </div>
  );
}

export default Lobby;