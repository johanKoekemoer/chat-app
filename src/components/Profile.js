import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout, storage } from "../Firebase"
import { query, collection, where, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

function Profile() {

  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [id, setId] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingPic, setEditingPic] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [visibility, setVisibility] = useState("hidden-input")

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setEmail(data.email);
      setName(data.name);
      setDisplayName(data.displayName)
      setBio(data.bio);
      setId(doc.docs[0].id);
      setImgUrl(data.profilePhotoUrl);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data, see console for details");
    }
  };

  useEffect(() => {
    if (user === null) {
      navigate("/");
    } else { fetchUserData() };
  }, [user]);

  const uploadProfilePicture = (event) => {
    setEditingPic(true);
    const file = event.target.files[0];
    setProfilePicture(file);
    setVisibility("visible-input")
  };

  const submitProfilePicture = async () => {
    setEditingPic(false);
    setVisibility("hidden-input")
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, profilePicture);
    const downloadURL = await getDownloadURL(ref(storage, `profilePictures/${user.uid}`));
    await updateDoc(doc(db, "users", id), { profilePhotoUrl: downloadURL });
    await fetchUserData();
  };

  const editName = () => {
    setEditingName(!editingName);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const uploadName = async () => {
    await updateDoc(doc(db, "users", id), { name: name });
  };
  const finishNameEdit = () => {
    setEditingName(!editingName);
    uploadName();
  };

  const editDisplayName = () => {
    setEditingDisplayName(!editingDisplayName);
  };
  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };
  const uploadDisplayName = async () => {
    await updateDoc(doc(db, "users", id), { displayName: displayName });
  };
  const finishDisplayNameEdit = () => {
    setEditingDisplayName(!editingDisplayName);
    uploadDisplayName();
  };

  const editBio = () => {
    setEditingBio(!editingBio);
  };
  const handleBioChange = (event) => {
    setBio(event.target.value);
  };
  const uploadBio = async () => {
    await updateDoc(doc(db, "users", id), { bio: bio });
  };
  const finishBioEdit = () => {
    setEditingBio(!editingBio);
    uploadBio();
  };

  const handleLogout = async () => {
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { online: false });
    await logout();
    navigate('/');
  };

  const chatPage = () => {
    navigate("/chat")
  };

  return (
    <div className="profile">
      <div className="profile-heading">
        <h3 className="profile-title">Your Profile</h3>
      </div>
      <div className="inner-container">
        <div className="picture-div">
          <input type="file" id="file-input" className={visibility} accept="image/*" onChange={uploadProfilePicture} />
          <label htmlFor="file-input">
            {editingPic ?
              null :
              (<img className="profile-img" src={imgUrl} alt={displayName + "'s Profile Photo"} />)}
          </label>
          {editingPic ?
            (<div className="apply-pic-div"><button onClick={submitProfilePicture}>Update Avatar<CheckIcon /></button></div>) :
            null}
        </div>
        <div className="email-div">
          <p>Email: <strong className="user-data">{email}</strong></p>
        </div>
        <div className="name-div">
          <p>
            {editingName ?
              (<input value={name} onChange={handleNameChange} />) :
              (<p>Name: <strong className="user-data">{name}</strong></p>)}
          </p>
          {!editingName ?
            (<button onClick={editName} className="edit-icon"><EditIcon /></button>) :
            (<button onClick={finishNameEdit}><CheckIcon /></button>)}
        </div>
        <div className="nick-div">
          <p>
            {editingDisplayName ?
              (<input value={displayName} onChange={handleDisplayNameChange} />) :
              (<p>Display name: <strong className="user-data">{displayName}</strong></p>)}
          </p>
          {!editingDisplayName ? (
            <button onClick={editDisplayName} className="edit-icon">
              <EditIcon />
            </button>
          ) : (
            <button onClick={finishDisplayNameEdit}><CheckIcon /></button>
          )}
        </div>
        <div className="bio-div">
          <p>
            {editingBio ?
              (<input value={bio} onChange={handleBioChange} />) :
              (<p>Bio: <strong className="user-data">{bio}</strong></p>)}
          </p>
          {!editingBio ?
            (<button onClick={editBio} className="edit-icon"><EditIcon /></button>) :
            (<button onClick={finishBioEdit}><CheckIcon /></button>)}
        </div>
        <div className="logout-div">
          <button className="chatpage__btn" onClick={chatPage}>
            Continue to Chat
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Profile;