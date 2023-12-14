import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase";
import "./Lobby.css";
import { collection, query, where, onSnapshot } from "@firebase/firestore";

const Lobby = ({ updateChat, selectedChat }) => {

  const [user] = useAuthState(auth);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [data, setData] = useState({});

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const userData = snapshot.docs.map((doc) => doc.data());
        let userObj = {};
        for (let i = 0; i < userData.length; i++) {
          userObj[userData[i].uid] = {
            name: userData[i].displayName,
            picUrl: userData[i].profilePhotoUrl,
            online: userData[i].online,
          };
        };
        setData(userObj);
      });
      return unsubscribe;
    } catch (error) { console.error("Error fetching User Data: " + error) }
  };

  const fetchHistory = async () => {
    try {
      const q = query(
        collection(db, "messages"),
        where("mid", ">=", user.uid),
        where("mid", "<=", user.uid + '\uf8ff')
      );

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

  const fetchOnline = async () => {
    try {
      const q = collection(db, "users");
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userDoc = snapshot.docs;
        const usersOnline = [];

        for (let i = 0; i < userDoc.length; i++) {
          const currentUser = userDoc[i].data();

          if (currentUser.online && user.uid !== currentUser.uid) {
            usersOnline.push({
              "uid": currentUser.uid,
              "profilePhotoUrl": currentUser.profilePhotoUrl,
              "displayName": currentUser.displayName,
            });
          };
        };

        setOnlineUsers(usersOnline);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching users online: " + error);
    }
  };

  const handleClick = (uid) => {
    updateChat(uid);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const unsubscribeHistory = fetchHistory();
        const unsubscribeData = fetchUserData();
        const unsubscribeOnline = fetchOnline();

        return () => {
          unsubscribeData();
          unsubscribeHistory();
          unsubscribeOnline();
        };
      }
    };

    fetchData();
  }, [selectedChat]);

  function OnlineUserList() {
    const handleClick = (uid) => {
      updateChat(uid);
    };
    return (
      <div className="user-list">
        {onlineUsers
          .filter((person) => !history.some((item) => item.uid === person.uid))
          .map((person, index) => (
            <div
              key={index}
              className="user"
              value={person.uid}
              onClick={() => handleClick(person.uid)}
            >
              <img
                className="img"
                src={data[person.uid].picUrl}
                alt={`${data[person.uid].name}'s Profile`}
              />
              <p className="name">{data[person.uid].name}</p>
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
            className="user"
            value={person.uid}
            onClick={() => handleClick(person.uid)}
          >
            <img
              className={`img ${data[person.uid]?.online ? 'online' : 'offline'}`}
              src={data[person.uid]?.picUrl}
              alt={`${data[person.uid]?.name}'s Profile`}
            />
            <p className="name">{data[person.uid]?.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="public-list">
        <div className="public-inner">
          <div className="user" onClick={() => handleClick("public")}><img className="public-img" src="https://firebasestorage.googleapis.com/v0/b/fireplace-7d903.appspot.com/o/Fireplace_logo.png?alt=media&token=b8ad67ed-4fee-4b44-8725-fabef8a5a9cc" alt="Firebase logo" /></div>
          <p className="name">Fireplace Chatroom</p>
        </div>
      </div>
      <div className="title-div">
        <p className="lobby-title">Chat History:</p>
      </div>
      <div className="chat-history">
        <ChatHistory />
      </div>
      <div className="title-div">
        <p className="lobby-title">Users Online:</p>
      </div>
      <div className="online-list">
        <OnlineUserList />
      </div>
    </div>
  );
}

export default Lobby;