import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { auth, db, logout, storage } from "../Firebase"
import { query, collection, where, getDocs, updateDoc, doc, addDoc} from "firebase/firestore/lite";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';



function Profile() {

  //Decalre state variables:
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [bio, setBio] = useState("");
  const [id, setId] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingNick, setEditingNick] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingPic, setEditingPic] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [visibility, setVisibility] = useState("hidden-input")

const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user.uid)); // Create a Firestore query to fetch user data
      const doc = await getDocs(q); // Execute the query and retrieve the document(s)
      const data = doc.docs[0].data(); // Extract the data from the first document
      setEmail(data.email); 
      setName(data.name); 
      setNick(data.nickname)
      setBio(data.bio);
      setId(doc.docs[0].id);
      setImgUrl(data.profilePhotoUrl);

    } catch (err) {
      console.error(err); // Log the error to the console
      alert("An error occurred while fetching user data, see console for details"); // Display an error message to the user
    }
  };


  useEffect(() => {
    if (user === null) {
      navigate("/");
    } else {fetchUserData()};
  },[user]);


  /////////// EDIT PROFILE PICTURE BLOCK
  const uploadProfilePicture = (event) => {
    setEditingPic(true);
    const file = event.target.files[0];
    setProfilePicture(file);
    setVisibility("visible-input")
  };
  const submitProfilePicture = async() => {
    setEditingPic(false);
    setVisibility("hidden-input")
    const downloadURL = await getDownloadURL(ref(storage, `profilePictures/${user.uid}`));
    await updateDoc(doc(db, "users", id), { profilePhotoUrl: downloadURL });
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, profilePicture);
    await fetchUserData();
  };
  ///////////

  /////////// EDIT NAME BLOCK
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
  ////////////

    /////////// EDIT NICK BLOCK
    const editNick = () => {
      setEditingNick(!editingNick);
    };
    const handleNickChange = (event) => {
      setNick(event.target.value);
    };
    const uploadNick = async () => {
      await updateDoc(doc(db, "users", id), { nickname: nick });
    };
    const finishNickEdit = () => {
      setEditingNick(!editingNick);
      uploadNick();
    };
    ////////////
    

    /////////// EDIT BIO BLOCK
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
    ////////////

  const logOut = () => {
    logout();
    navigate("/")
  };


  return (
    <div className="profile">
      <div className="profile-heading">
        <h3>{nick}'s Profile</h3>
      </div>

      <div className="inner-container">
        <div className="picture-div">
          <input type="file" id="file-input" className={visibility} accept="image/*" onChange={uploadProfilePicture}/>
          <label htmlFor="file-input">
            {editingPic ?
              null :
              (<img className="img" src={imgUrl} alt={nick + "'s Profile Photo"}/>)}
          </label>
          {editingPic ?
           (<div className="apply-pic-div"><button onClick={submitProfilePicture}>Update Avatar<CheckIcon/></button></div>) :
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
           (<button onClick={finishNameEdit}><CheckIcon/></button>)}
        </div>

        <div className="nick-div">
          <p>
            {editingNick ?
              (<input value={nick} onChange={handleNickChange} />) :
              (<p>Nickname: <strong className="user-data">{nick}</strong></p>)}
          </p>
          {!editingNick ? (
            <button onClick={editNick} className="edit-icon">
              <EditIcon />
            </button>
          ) : (
            <button onClick={finishNickEdit}><CheckIcon/></button>
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
            (<button onClick={finishBioEdit}><CheckIcon/></button>)}
        </div>

        <div className="logout-div">
          <button onClick={logOut}>Logout</button>
        </div>
      </div>
    </div>
    
  )
}

export default Profile;

