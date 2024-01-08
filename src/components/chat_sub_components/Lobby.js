import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase";
import "./Lobby.css";
import flameImage from '../../images/flame-48.png';
import { collection, query, where, onSnapshot, or, and, getDocs, doc, updateDoc, limit } from "@firebase/firestore";

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
        msgData.sort((a, b) => b.timeSent - a.timeSent);

        const latestMessages = {};
        msgData.forEach(message => {
          const { idSender, idReciever, timeSent } = message;
          const otherUser = (idSender === user.uid ? idReciever : idSender);
          
          if (!latestMessages[otherUser] || timeSent > latestMessages[otherUser].timeSent) {
            latestMessages[otherUser] = message;
          }
        });
        const resultArray = Object.values(latestMessages);

        let histData = [];
        for (let i = 0; i < resultArray.length; i++) {
          const currentMsg = resultArray[i];
          const senderOrReceiverUid = currentMsg.idReciever === user.uid ? currentMsg.idSender : currentMsg.idReciever;

          if (!histData.some((obj) => obj.uid === senderOrReceiverUid)) {
            histData.push({
              uid: senderOrReceiverUid,
              recieved: (currentMsg.idReciever === user.uid ? true : false),
              text: currentMsg.text,
              isRead: currentMsg.isRead,
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
        .filter((userdata) => userdata.online)
        .filter((userdata) => userdata.uid !== user.uid)
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

  const markAsRead = async () => {

    try {
      const collectionRef = collection(db, "messages");
      const q = query(collectionRef, and(
        where("idSender", "==", selectedChat),
        where("idReciever", "==", user.uid),
        where("isRead", "==", false)
      ));
      const data = await getDocs(q);
      const midArray = data.docs.map((doc) => doc.data().mid);

      midArray.forEach(async (mid) => {
        const ref = doc(db, "messages", mid);
        await updateDoc(ref, {
          isRead: true,
        });
      });
    } catch (error) {
      console.error("Error marking messages as read: " + error);
    }
  };



  const handleClick = (uid) => {
    updateChat(uid);
  };


  useEffect(() => {
    if (selectedChat !== "" && selectedChat !== "public") {
      markAsRead();
    };
  }, [selectedChat, history]);

  useEffect(() => {
    if (user) {
      getOnlineUsers();
      getOfflineUsers();
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    };
  }, [userData]);

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
    return (
      <div className="user-list">
        {history.map((person, index) => (
          <div
            key={index}
            className={selectedChat === person.uid ? "user-selected" : "user"}
            value={person.uid}
            onClick={() => handleClick(person.uid)}
          >
            {(person.isRead === false && person.recieved === true) ? (
              <>
                <img
                  className={"lobby-notification-img"}
                  src={flameImage}
                  alt={"notification image"}
                  width={35}
                  height={35}
                />
              </>) : null}
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
      <div className="outer-list">
        <div className="user-list">
          <div className={selectedChat === "public" ? "user-selected" : "user"} onClick={() => handleClick("public")}>
            <img className="public-img"
              src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/Fireplace_logo.png?alt=media&token=b8ad67ed-4fee-4b44-8725-fabef8a5a9cc"
              alt="Firebase logo" />
            <p className="name">Fireplace Chatroom</p>
          </div>
        </div>
      </div>
      {history.length === 0 ? null :
        (<><div className="title-div">
          <p className="lobby-title">Chat History:</p>
        </div>
          <div className="outer-list">
            <ChatHistory />
          </div></>)}
      {onlineUsers.length === 0 ? null : (
        <><div className="title-div">
          <p className="lobby-title">Users Online:</p>
        </div>
          <div className="outer-list">
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